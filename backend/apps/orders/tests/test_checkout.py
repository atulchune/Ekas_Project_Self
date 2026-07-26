from rest_framework.test import APIClient

from apps.accounts.models import Address, User
from apps.core.testutils import BaseAPITestCase, make_product
from apps.inventory.models import Inventory
from apps.orders.models import Order
from apps.orders.services import release_expired_reservations


class CheckoutTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.client = APIClient()
        self.user = User.objects.create_user(email="buyer@example.com", password="StrongPass123!")
        self.client.post("/api/v1/auth/login/", {"email": "buyer@example.com", "password": "StrongPass123!"}, format="json")
        self.product, self.variant = make_product(stock=5)
        self.address = Address.objects.create(
            user=self.user, full_name="Buyer", phone="9999999999", line1="Line 1",
            city="Bengaluru", state="KA", pincode="560001",
        )

    def _add_to_cart(self, quantity=2):
        return self.client.post("/api/v1/cart/", {"variant_id": str(self.variant.id), "quantity": quantity}, format="json")

    def test_cod_checkout_confirms_order_and_commits_stock(self):
        self._add_to_cart(2)
        response = self.client.post(
            "/api/v1/checkout/",
            {"address_id": str(self.address.id), "payment_method": "cod", "idempotency_key": "key-1"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], Order.CONFIRMED)
        inventory = Inventory.objects.get(variant=self.variant)
        self.assertEqual(inventory.on_hand_quantity, 3)
        self.assertEqual(inventory.sold_quantity, 2)

    def test_checkout_is_idempotent(self):
        self._add_to_cart(1)
        first = self.client.post(
            "/api/v1/checkout/",
            {"address_id": str(self.address.id), "payment_method": "cod", "idempotency_key": "same-key"},
            format="json",
        )
        # Re-adding to cart to simulate a retried request against an already-converted cart.
        second = self.client.post(
            "/api/v1/checkout/",
            {"address_id": str(self.address.id), "payment_method": "cod", "idempotency_key": "same-key"},
            format="json",
        )
        self.assertEqual(first.data["order_number"], second.data["order_number"])
        self.assertEqual(Order.objects.filter(idempotency_key="same-key").count(), 1)

    def test_cannot_oversell_stock(self):
        self._add_to_cart(10)  # only 5 in stock
        response = self.client.post(
            "/api/v1/checkout/",
            {"address_id": str(self.address.id), "payment_method": "cod", "idempotency_key": "key-oversell"},
            format="json",
        )
        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.data["error"]["code"], "insufficient_stock")
        self.assertEqual(Inventory.objects.get(variant=self.variant).on_hand_quantity, 5)

    def test_online_payment_reserves_then_expiry_releases_stock(self):
        self._add_to_cart(2)
        response = self.client.post(
            "/api/v1/checkout/",
            {"address_id": str(self.address.id), "payment_method": "online", "idempotency_key": "key-online"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], Order.PENDING_PAYMENT)
        inventory = Inventory.objects.get(variant=self.variant)
        self.assertEqual(inventory.reserved_quantity, 2)
        self.assertEqual(inventory.on_hand_quantity, 5)  # not yet committed

        order = Order.objects.get(order_number=response.data["order_number"])
        order.reservation_expires_at = order.reservation_expires_at.replace(year=2000)
        order.save(update_fields=["reservation_expires_at"])

        released = release_expired_reservations()
        self.assertEqual(released, 1)
        inventory.refresh_from_db()
        self.assertEqual(inventory.reserved_quantity, 0)
        order.refresh_from_db()
        self.assertEqual(order.status, Order.PAYMENT_FAILED)
