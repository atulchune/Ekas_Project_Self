from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.cart.models import Cart
from apps.core.testutils import BaseAPITestCase, make_product


class CartAndGuestMergeTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.client = APIClient()
        self.product, self.variant = make_product()

    def test_guest_can_add_to_cart_and_gets_persistent_cookie(self):
        response = self.client.post("/api/v1/cart/", {"variant_id": str(self.variant.id), "quantity": 2}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["item_count"], 2)
        self.assertIn("ekas_guest_cart", response.cookies)

    def test_guest_cart_merges_into_user_cart_on_login(self):
        add_response = self.client.post("/api/v1/cart/", {"variant_id": str(self.variant.id), "quantity": 1}, format="json")
        self.assertEqual(add_response.status_code, 201)

        User.objects.create_user(email="merge@example.com", password="StrongPass123!")
        login_response = self.client.post(
            "/api/v1/auth/login/", {"email": "merge@example.com", "password": "StrongPass123!"}, format="json"
        )
        self.assertEqual(login_response.status_code, 200)

        cart_response = self.client.get("/api/v1/cart/")
        self.assertEqual(cart_response.data["item_count"], 1)
        user = User.objects.get(email="merge@example.com")
        self.assertTrue(Cart.objects.filter(user=user, items__variant=self.variant).exists())

    def test_cannot_add_inactive_variant(self):
        self.variant.is_active = False
        self.variant.save(update_fields=["is_active"])
        response = self.client.post("/api/v1/cart/", {"variant_id": str(self.variant.id), "quantity": 1}, format="json")
        self.assertEqual(response.status_code, 400)
