import json

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.exceptions import ApplicationError
from apps.orders.models import Order

from .providers import MockPaymentProvider, get_payment_provider
from .services import process_webhook_event, verify_payment


class MockSimulatePaymentView(APIView):
    """Dev-only endpoint standing in for the Razorpay checkout widget when
    no real gateway credentials are configured. Returns 404 whenever the
    active provider isn't the mock provider, so it can never be reached in
    a properly configured production deployment."""

    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = "checkout"

    def post(self, request):
        provider = get_payment_provider()
        if not isinstance(provider, MockPaymentProvider):
            raise ApplicationError("Mock payment simulation is disabled.", code="mock_disabled", status_code=404)

        order_number = request.data.get("order_number")
        order = Order.objects.filter(order_number=order_number, user=request.user).first()
        if not order:
            raise ApplicationError("Order not found.", code="order_not_found", status_code=404)
        payment = order.payments.order_by("-created_at").first()
        if not payment:
            raise ApplicationError("No payment found for this order.", code="payment_not_found", status_code=404)

        result = provider.simulate_payment(payment.provider_order_id)
        return Response({"provider_order_id": payment.provider_order_id, **result})


class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = "checkout"

    def post(self, request):
        order_number = request.data.get("order_number")
        try:
            order = Order.objects.get(order_number=order_number, user=request.user)
        except Order.DoesNotExist:
            raise ApplicationError("Order not found.", code="order_not_found", status_code=404)

        payment, order = verify_payment(
            order=order,
            provider_order_id=request.data.get("provider_order_id"),
            provider_payment_id=request.data.get("provider_payment_id"),
            signature=request.data.get("signature", ""),
        )
        return Response({"status": order.status, "order_number": order.order_number})


class RazorpayWebhookView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_scope = "webhook"

    def post(self, request):
        provider = get_payment_provider()
        signature = request.headers.get("X-Razorpay-Signature", "")
        verified = provider.verify_webhook_signature(body=request.body.decode("utf-8"), signature=signature)
        payload = request.data
        event_id = request.headers.get("X-Razorpay-Event-Id") or payload.get("id") or json.dumps(payload)[:140]
        process_webhook_event(
            provider_name=provider.name,
            event_id=event_id,
            event_type=payload.get("event", "unknown"),
            payload=payload,
            verified=verified,
        )
        return Response({"status": "ok"})
