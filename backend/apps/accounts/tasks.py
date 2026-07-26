import logging

from celery import shared_task
from django.conf import settings

from apps.engagement.models import NotificationLog
from apps.engagement.providers import get_email_provider

logger = logging.getLogger(__name__)


@shared_task
def send_transactional_email(*, user_id, to_email, subject, body, template_code=""):
    log = NotificationLog.objects.create(
        user_id=user_id, channel="email", template_code=template_code,
        recipient=to_email, subject=subject, body=body,
    )
    try:
        get_email_provider().send(to_email, subject, body)
        log.status = NotificationLog.SENT
        from django.utils import timezone

        log.sent_at = timezone.now()
    except Exception as exc:  # pragma: no cover - defensive logging path
        log.status = NotificationLog.FAILED
        log.error_message = str(exc)
        logger.error("email_send_failed", extra={"error": str(exc), "to": to_email})
    log.save()
    return log.status


def queue_verification_email(user, token):
    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    send_transactional_email.delay(
        user_id=str(user.id),
        to_email=user.email,
        subject="Verify your EKAS Healthy Foods account",
        body=f"Welcome to EKAS Healthy Foods!\n\nPlease verify your email by visiting:\n{verify_url}\n\nThis link expires in 24 hours.",
        template_code="email_verification",
    )


def queue_password_reset_email(user, token):
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    send_transactional_email.delay(
        user_id=str(user.id),
        to_email=user.email,
        subject="Reset your EKAS Healthy Foods password",
        body=f"We received a request to reset your password.\n\nReset it here:\n{reset_url}\n\nIf you did not request this, you can ignore this email.",
        template_code="password_reset",
    )


def queue_welcome_email(user):
    send_transactional_email.delay(
        user_id=str(user.id),
        to_email=user.email,
        subject="Welcome to EKAS Healthy Foods",
        body="Thank you for creating an account with EKAS Healthy Foods -- pure, traditional, empowering.",
        template_code="welcome",
    )
