"""Payment-provider interface. All secrets stay server-side; the frontend
only ever receives a provider order id + publishable key id, never a
secret. `mock` is an explicitly-labelled local/dev provider used whenever
Razorpay credentials are absent so the stack always runs end to end."""
import hashlib
import hmac
import uuid
from abc import ABC, abstractmethod

from django.conf import settings


class PaymentProviderError(Exception):
    pass


class PaymentProvider(ABC):
    name = "base"

    @abstractmethod
    def create_order(self, *, amount, currency, receipt):
        """Returns {"provider_order_id", "amount", "currency", "key_id"}"""

    @abstractmethod
    def verify_payment(self, *, provider_order_id, provider_payment_id, signature):
        """Returns True/False"""

    @abstractmethod
    def verify_webhook_signature(self, *, body, signature):
        ...

    @abstractmethod
    def refund(self, *, provider_payment_id, amount):
        """Returns {"provider_refund_id", "status"}"""


class MockPaymentProvider(PaymentProvider):
    """Deterministic local provider: any payment_id/signature pair generated
    by `create_order` will verify successfully, so the whole checkout ->
    payment -> order-confirmed flow works without external credentials."""

    name = "mock"

    def create_order(self, *, amount, currency, receipt):
        provider_order_id = f"mock_order_{uuid.uuid4().hex[:16]}"
        return {
            "provider_order_id": provider_order_id,
            "amount": float(amount),
            "currency": currency,
            "key_id": "mock_key",
        }

    def _expected_signature(self, provider_order_id, provider_payment_id):
        message = f"{provider_order_id}|{provider_payment_id}"
        return hmac.new(b"mock-secret", message.encode(), hashlib.sha256).hexdigest()

    def verify_payment(self, *, provider_order_id, provider_payment_id, signature):
        return signature == self._expected_signature(provider_order_id, provider_payment_id)

    def simulate_payment(self, provider_order_id):
        """Dev-only helper standing in for the Razorpay checkout widget: a
        real gateway hands the browser a payment id + signature after the
        buyer pays. Locally there is no gateway, so the backend (which is
        the only place that knows the mock secret) mints an equivalent pair
        so the storefront can exercise the exact same verify() call path."""
        provider_payment_id = f"mock_pay_{uuid.uuid4().hex[:16]}"
        signature = self._expected_signature(provider_order_id, provider_payment_id)
        return {"provider_payment_id": provider_payment_id, "signature": signature}

    def verify_webhook_signature(self, *, body, signature):
        return True

    def refund(self, *, provider_payment_id, amount):
        return {"provider_refund_id": f"mock_refund_{uuid.uuid4().hex[:16]}", "status": "processed"}


class RazorpayProvider(PaymentProvider):
    name = "razorpay"

    def __init__(self):
        import razorpay

        self.client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    def create_order(self, *, amount, currency, receipt):
        order = self.client.order.create(
            {"amount": int(amount * 100), "currency": currency, "receipt": receipt, "payment_capture": 1}
        )
        return {
            "provider_order_id": order["id"],
            "amount": float(amount),
            "currency": currency,
            "key_id": settings.RAZORPAY_KEY_ID,
        }

    def verify_payment(self, *, provider_order_id, provider_payment_id, signature):
        try:
            self.client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": provider_order_id,
                    "razorpay_payment_id": provider_payment_id,
                    "razorpay_signature": signature,
                }
            )
            return True
        except Exception:
            return False

    def verify_webhook_signature(self, *, body, signature):
        try:
            self.client.utility.verify_webhook_signature(body, signature, settings.RAZORPAY_WEBHOOK_SECRET)
            return True
        except Exception:
            return False

    def refund(self, *, provider_payment_id, amount):
        refund = self.client.payment.refund(provider_payment_id, {"amount": int(amount * 100)})
        return {"provider_refund_id": refund["id"], "status": refund.get("status", "processed")}


def get_payment_provider() -> PaymentProvider:
    if settings.PAYMENT_PROVIDER == "razorpay" and settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET:
        return RazorpayProvider()
    return MockPaymentProvider()
