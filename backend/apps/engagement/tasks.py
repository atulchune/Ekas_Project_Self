import logging
from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from .models import ContactEnquiry, NotificationLog
from .providers import get_email_provider

logger = logging.getLogger(__name__)


def _send(*, user_id, to_email, subject, body, channel="email", template_code=""):
    log = NotificationLog.objects.create(
        user_id=user_id, channel=channel, template_code=template_code, recipient=to_email, subject=subject, body=body
    )
    try:
        get_email_provider().send(to_email, subject, body)
        log.status = NotificationLog.SENT
        log.sent_at = timezone.now()
    except Exception as exc:  # pragma: no cover
        log.status = NotificationLog.FAILED
        log.error_message = str(exc)
        logger.error("notification_send_failed", extra={"error": str(exc)})
    log.save()
    return log.status


@shared_task
def send_enquiry_acknowledgement(*, enquiry_id):
    try:
        enquiry = ContactEnquiry.objects.get(pk=enquiry_id)
    except ContactEnquiry.DoesNotExist:
        return "not_found"
    _send(
        user_id=None,
        to_email=enquiry.email,
        subject="We've received your message -- EKAS Healthy Foods",
        body=f"Hi {enquiry.name},\n\nThank you for reaching out to EKAS Healthy Foods. Our team will respond within 1-2 business days.\n\nYour message:\n{enquiry.message}",
        template_code="enquiry_ack",
    )
    enquiry.acknowledged_at = timezone.now()
    enquiry.save(update_fields=["acknowledged_at"])
    return "sent"


@shared_task
def send_newsletter_campaign(*, subject, body):
    from .models import NewsletterSubscriber

    count = 0
    for subscriber in NewsletterSubscriber.objects.filter(is_active=True):
        _send(user_id=None, to_email=subscriber.email, subject=subject, body=body, template_code="newsletter")
        count += 1
    return count


@shared_task
def send_order_status_email(*, user_id, to_email, order_number, status_label, body_extra=""):
    _send(
        user_id=user_id,
        to_email=to_email,
        subject=f"Order {order_number}: {status_label} -- EKAS Healthy Foods",
        body=f"Your order {order_number} is now {status_label}.\n\n{body_extra}",
        template_code="order_status",
    )


@shared_task
def send_abandoned_cart_reminders():
    from apps.cart.models import Cart

    threshold = timezone.now() - timedelta(hours=6)
    candidates = Cart.objects.filter(
        status=Cart.ACTIVE, user__isnull=False, updated_at__lt=threshold, abandoned_reminder_sent_at__isnull=True
    ).exclude(items__isnull=True).distinct()
    sent = 0
    for cart in candidates:
        if not cart.items.exists():
            continue
        _send(
            user_id=str(cart.user_id),
            to_email=cart.user.email,
            subject="You left something pure and traditional in your cart",
            body="Your EKAS Healthy Foods cart is waiting for you. Complete your order before items sell out.",
            template_code="abandoned_cart",
        )
        cart.abandoned_reminder_sent_at = timezone.now()
        cart.save(update_fields=["abandoned_reminder_sent_at"])
        sent += 1
    return sent


@shared_task
def send_low_stock_alerts():
    from apps.inventory.models import Inventory
    from apps.operations.models import StaffProfile

    low_stock = Inventory.objects.select_related("variant__product").filter(
        on_hand_quantity__lte=models_f_low_stock_threshold()
    )
    if not low_stock.exists():
        return 0
    lines = [f"- {i.variant.product.name} ({i.variant.label}): {i.available_quantity} left" for i in low_stock]
    recipients = StaffProfile.objects.filter(user__is_active=True, receives_low_stock_alerts=True).select_related("user")
    for staff in recipients:
        _send(
            user_id=str(staff.user_id),
            to_email=staff.user.email,
            subject="Low stock alert -- EKAS Healthy Foods Operations",
            body="The following variants are low on stock:\n\n" + "\n".join(lines),
            template_code="low_stock_alert",
        )
    return recipients.count()


def models_f_low_stock_threshold():
    from django.db.models import F

    return F("low_stock_threshold")


@shared_task
def send_review_request(*, user_id, to_email, order_number):
    _send(
        user_id=user_id,
        to_email=to_email,
        subject=f"How was your order {order_number}?",
        body="We'd love to hear about your experience. Share a review on the products you received.",
        template_code="review_request",
    )
