from rest_framework.test import APIClient

from apps.accounts.models import Address, User
from apps.catalog.models import Category, Product
from apps.core.testutils import BaseAPITestCase, make_product
from apps.operations.models import StaffProfile
from apps.orders.models import Order


class StaffWorkflowTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.client = APIClient()
        self.staff = User.objects.create_user(email="ops@ekas.local", password="StrongPass123!", is_staff=True)
        StaffProfile.objects.create(user=self.staff, is_super_admin=True)
        self.client.post("/api/v1/operations/auth/login/", {"email": "ops@ekas.local", "password": "StrongPass123!"}, format="json")

    def test_staff_created_product_becomes_visible_on_storefront_once_published(self):
        category = Category.objects.create(name="Ghee", slug="ghee")
        create = self.client.post(
            "/api/v1/operations/products/",
            {"category": str(category.id), "name": "New Ghee", "slug": "new-ghee", "status": Product.DRAFT},
            format="json",
        )
        self.assertEqual(create.status_code, 201)
        product_id = create.data["id"]

        storefront = APIClient()
        listing = storefront.get("/api/v1/products/")
        self.assertNotIn("New Ghee", [p["name"] for p in listing.data["results"]])

        publish = self.client.patch(f"/api/v1/operations/products/{product_id}/", {"status": Product.PUBLISHED}, format="json")
        self.assertEqual(publish.status_code, 200)

        listing_after = storefront.get("/api/v1/products/")
        self.assertIn("New Ghee", [p["name"] for p in listing_after.data["results"]])

    def test_inventory_restock_reflects_on_storefront_stock_status(self):
        product, variant = make_product(stock=0)
        storefront = APIClient()
        before = storefront.get(f"/api/v1/products/{product.slug}/")
        self.assertEqual(before.data["variants"][0]["stock_status"], "out_of_stock")

        restock = self.client.post(f"/api/v1/operations/inventory/{variant.id}/restock/", {"quantity": 20, "reason": "New batch arrived"}, format="json")
        self.assertEqual(restock.status_code, 200)

        after = storefront.get(f"/api/v1/products/{product.slug}/")
        self.assertEqual(after.data["variants"][0]["stock_status"], "in_stock")

    def test_order_status_transitions_are_visible_to_customer(self):
        customer = User.objects.create_user(email="cust2@example.com", password="StrongPass123!")
        product, variant = make_product(stock=10)
        address = Address.objects.create(
            user=customer, full_name="Cust", phone="9999999999", line1="L1", city="B", state="KA", pincode="560001",
        )
        from apps.cart.models import Cart, CartItem
        from apps.orders.services import checkout as checkout_service

        cart = Cart.objects.create(user=customer)
        CartItem.objects.create(cart=cart, variant=variant, quantity=1)
        order, _ = checkout_service(
            user=customer, cart=cart, address=address, billing_address=None,
            payment_method=Order.COD, coupon_code=None, idempotency_key="wf-key",
        )

        transition = self.client.post(f"/api/v1/operations/orders/{order.order_number}/transition/", {"status": Order.PACKED}, format="json")
        self.assertEqual(transition.status_code, 200)

        customer_client = APIClient()
        customer_client.post("/api/v1/auth/login/", {"email": "cust2@example.com", "password": "StrongPass123!"}, format="json")
        detail = customer_client.get(f"/api/v1/orders/{order.order_number}/")
        self.assertEqual(detail.data["status"], Order.PACKED)
        self.assertTrue(any(h["to_status"] == Order.PACKED for h in detail.data["status_history"]))
