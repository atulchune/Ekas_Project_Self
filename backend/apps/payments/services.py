from django.db import transaction

from apps.core.exceptions import ApplicationError
from apps.orders.models import Order
from apps.orders.services import confirm_paid_order, release_failed_order

from .models import Payment, Refund, WebhookEvent
from .providers import get_payment_provider


@transaction.atomic
def create_payment_for_order(order: Order):
    if order.payment_method != Order.ONLINE:
        raise ApplicationError("This order does not require online payment.", code="not_online_order", status_code=400)
    provider = get_payment_provider()
    result = provider.create_order(amount=order.total, currency="INR", receipt=order.order_number)
    payment = Payment.objects.create(
        order=order,
        provider=provider.name,
        status=Payment.CREATED,
        amount=order.total,
        provider_order_id=result["provider_order_id"],
        raw_response=result,
    )
    return payment, result


def verify_payment(*, order: Order, provider_order_id, provider_payment_id, signature):
    """Deliberately NOT wrapped in a single @transaction.atomic: the failed-
    signature branch must commit its DB writes (payment marked failed,
    reservation released) before the ApplicationError propagates -- if the
    whole function were one atomic block, raising out of it would roll back
    those very writes and leave stock reserved forever."""
    payment = order.payments.filter(provider_order_id=provider_order_id).order_by("-created_at").first()
    if not payment:
        raise ApplicationError("No matching payment found for this order.", code="payment_not_found", status_code=404)

    if payment.status == Payment.CAPTURED:
        return payment, order  # idempotent: already confirmed

    provider = get_payment_provider()
    is_valid = provider.verify_payment(
        provider_order_id=provider_order_id, provider_payment_id=provider_payment_id, signature=signature
    )
    if not is_valid:
        with transaction.atomic():
            payment.status = Payment.FAILED
            payment.failure_reason = "Signature verification failed"
            payment.save(update_fields=["status", "failure_reason"])
            release_failed_order(order, reason="Payment signature invalid")
        raise ApplicationError("Payment verification failed.", code="payment_verification_failed", status_code=400)

    with transaction.atomic():
        payment.status = Payment.CAPTURED
        payment.provider_payment_id = provider_payment_id
        payment.provider_signature = signature
        payment.save(update_fields=["status", "provider_payment_id", "provider_signature"])
        order = confirm_paid_order(order)
    return payment, order


@transaction.atomic
def process_webhook_event(*, provider_name, event_id, event_type, payload, verified):
    """Idempotent: a WebhookEvent row with a unique `event_id` guarantees a
    replayed delivery from the provider can never double-process an order."""
    if not verified:
        raise ApplicationError("Invalid webhook signature.", code="invalid_webhook_signature", status_code=400)

    event, created = WebhookEvent.objects.get_or_create(
        provider=provider_name, event_id=event_id, defaults={"event_type": event_type, "payload": payload}
    )
    if not created:
        return event  # already processed; no-op

    from django.utils import timezone

    provider_payment_id = payload.get("payment", {}).get("entity", {}).get("id") or payload.get("payment_id")
    provider_order_id = payload.get("payment", {}).get("entity", {}).get("order_id") or payload.get("order_id")

    payment = Payment.objects.filter(provider_order_id=provider_order_id).order_by("-created_at").first()
    if payment:
        if event_type in ("payment.captured", "order.paid") and payment.status != Payment.CAPTURED:
            payment.status = Payment.CAPTURED
            payment.provider_payment_id = provider_payment_id or payment.provider_payment_id
            payment.save(update_fields=["status", "provider_payment_id"])
            confirm_paid_order(payment.order)
        elif event_type == "payment.failed":
            payment.status = Payment.FAILED
            payment.save(update_fields=["status"])
            release_failed_order(payment.order, reason="Payment failed webhook received")

    event.processed = True
    event.processed_at = timezone.now()
    event.save(update_fields=["processed", "processed_at"])
    return event


@transaction.atomic
def issue_refund(*, order: Order, amount, reason, staff):
    payment = order.payments.filter(status=Payment.CAPTURED).order_by("-created_at").first()
    if not payment and order.payment_method != Order.COD:
        raise ApplicationError("No captured payment found to refund.", code="no_captured_payment", status_code=409)

    refund = Refund.objects.create(
        payment=payment, order=order, amount=amount, reason=reason, requested_by=staff, status=Refund.PROCESSING
    )
    if payment:
        provider = get_payment_provider()
        result = provider.refund(provider_payment_id=payment.provider_payment_id, amount=amount)
        refund.provider_refund_id = result["provider_refund_id"]
    refund.status = Refund.COMPLETED
    from django.utils import timezone

    refund.processed_at = timezone.now()
    refund.save()

    if payment and amount >= order.total:
        order.status = Order.REFUNDED
        order.save(update_fields=["status"])
    return refund
