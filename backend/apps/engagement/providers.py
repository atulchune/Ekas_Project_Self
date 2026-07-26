"""Provider interfaces for outbound notifications.

Each channel has a small ABC so a real SMS/WhatsApp vendor can be dropped in
later purely through configuration (`SMS_PROVIDER` / `WHATSAPP_PROVIDER`).
In development, and whenever no vendor credentials are configured, the
console providers log the message instead of calling out to a paid API.
"""
import logging
from abc import ABC, abstractmethod

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


class EmailProvider(ABC):
    @abstractmethod
    def send(self, to_email, subject, body):
        ...


class DjangoEmailProvider(EmailProvider):
    """Delegates to Django's EMAIL_BACKEND, which is itself the console
    backend in development and real SMTP in production."""

    def send(self, to_email, subject, body):
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [to_email], fail_silently=False)
        return True


class SMSProvider(ABC):
    @abstractmethod
    def send(self, to_phone, body):
        ...


class ConsoleSMSProvider(SMSProvider):
    def send(self, to_phone, body):
        logger.info("sms_dispatch_mock", extra={"to": to_phone, "body": body})
        return True


class WhatsAppProvider(ABC):
    @abstractmethod
    def send(self, to_phone, body):
        ...


class ConsoleWhatsAppProvider(WhatsAppProvider):
    def send(self, to_phone, body):
        logger.info("whatsapp_dispatch_mock", extra={"to": to_phone, "body": body})
        return True


def get_email_provider() -> EmailProvider:
    return DjangoEmailProvider()


def get_sms_provider() -> SMSProvider:
    if settings.SMS_PROVIDER == "console":
        return ConsoleSMSProvider()
    return ConsoleSMSProvider()  # placeholder until a real vendor is configured


def get_whatsapp_provider() -> WhatsAppProvider:
    if settings.WHATSAPP_PROVIDER == "console":
        return ConsoleWhatsAppProvider()
    return ConsoleWhatsAppProvider()
