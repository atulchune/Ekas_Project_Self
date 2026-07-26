from rest_framework.test import APIClient

from apps.accounts.models import Address, User
from apps.core.testutils import BaseAPITestCase, make_product
from apps.inventory.models import Inventory
from apps.orders.models import Order
from apps.payments.models import Payment
from apps.payments.providers import MockPaymentProvider
from apps.payments.services import process_webhook_event


class OnlinePaymentTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.client = APIClient()
        self.user = User.objects.create_user(email="payer@example.com", password="StrongPass123!")
        self.client.post("/api/v1/auth/login/", {"email": "payer@example.com", "password": "StrongPass123!"}, format="json")
        self.product, self.variant = make_product(stock=10)
        self.address = Address.objects.create(
            user=self.user, full_name="Payer", phone="9999999999", line1="Line 1",
            city="Bengaluru", state="KA", pincode="560001",
        )
        self.client.post("/api/v1/cart/", {"variant_id": str(self.variant.id), "quantity": 3}, format="json")
        checkout = self.client.post(
            "/api/v1/checkout/",
            {"address_id": str(self.address.id), "payment_method": "online", "idempotency_key": "pay-key-1"},
            format="json",
        )
        self.order_number = checkout.data["order_number"]
        self.provider_order_id = checkout.data["payment"]["provider_order_id"]

    def test_verify_payment_confirms_order_and_commits_stock(self):
        provider = MockPaymentProvider()
        payment_id = "pay_mock_123"
        signature = provider._expected_signature(self.provider_order_id, payment_id)

        response = self.client.post(
            "/api/v1/payments/verify/",
            {
                "order_number": self.order_number,
                "provider_order_id": self.provider_order_id,
                "provider_payment_id": payment_id,
                "signature": signature,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], Order.CONFIRMED)
        inventory = Inventory.objects.get(variant=self.variant)
        self.assertEqual(inventory.on_hand_quantity, 7)
        self.assertEqual(inventory.reserved_quantity, 0)

    def test_invalid_signature_fails_and_keeps_order_pending(self):
        response = self.client.post(
            "/api/v1/payments/verify/",
            {
                "order_number": self.order_number,
                "provider_order_id": self.provider_order_id,
                "provider_payment_id": "pay_mock_bad",
                "signature": "not-a-real-signature",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        order = Order.objects.get(order_number=self.order_number)
        self.assertEqual(order.status, Order.PAYMENT_FAILED)
        inventory = Inventory.objects.get(variant=self.variant)
        self.assertEqual(inventory.reserved_quantity, 0)  # released back


class WebhookIdempotencyTests(BaseAPITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="webhookbuyer@example.com", password="StrongPass123!")
        self.product, self.variant = make_product(stock=10)
        from apps.orders.services import checkout as checkout_service
        from apps.cart.models import Cart, CartItem

        cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(cart=cart, variant=self.variant, quantity=1)
        address = Address.objects.create(
            user=self.user, full_name="Buyer", phone="9999999999", line1="L1", city="B", state="KA", pincode="560001",
        )
        self.order, _ = checkout_service(
            user=self.user, cart=cart, address=address, billing_address=None,
            payment_method=Order.ONLINE, coupon_code=None, idempotency_key="webhook-key",
        )
        self.payment = Payment.objects.create(
            order=self.order, provider="mock", status=Payment.CREATED,
            amount=self.order.total, provider_order_id="mock_order_abc",
        )

    def test_duplicate_webhook_event_only_confirms_order_once(self):
        payload = {"event": "payment.captured", "payment": {"entity": {"id": "pay_1", "order_id": "mock_order_abc"}}}
        process_webhook_event(provider_name="mock", event_id="evt-1", event_type="payment.captured", payload=payload, verified=True)
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, Order.CONFIRMED)
        inventory = Inventory.objects.get(variant=self.variant)
        self.assertEqual(inventory.on_hand_quantity, 9)

        # Replay the identical webhook delivery -- must be a no-op.
        process_webhook_event(provider_name="mock", event_id="evt-1", event_type="payment.captured", payload=payload, verified=True)
        inventory.refresh_from_db()
        self.assertEqual(inventory.on_hand_quantity, 9)
