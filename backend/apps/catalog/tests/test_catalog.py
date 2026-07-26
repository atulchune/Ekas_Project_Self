from rest_framework.test import APIClient

from apps.catalog.models import Product
from apps.core.testutils import BaseAPITestCase, make_product


class CatalogVisibilityTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.client = APIClient()

    def test_only_published_products_are_listed(self):
        make_product(name="Published Oil", slug="published-oil")
        draft_product, _ = make_product(name="Draft Oil", slug="draft-oil")
        draft_product.status = Product.DRAFT
        draft_product.save(update_fields=["status"])

        response = self.client.get("/api/v1/products/")
        names = [p["name"] for p in response.data["results"]]
        self.assertIn("Published Oil", names)
        self.assertNotIn("Draft Oil", names)

    def test_product_detail_includes_variants_and_stock_status(self):
        _, variant = make_product(name="Ghee", slug="ghee-test", stock=3)
        response = self.client.get("/api/v1/products/ghee-test/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["variants"]), 1)
        self.assertEqual(response.data["variants"][0]["available_quantity"], 3)

    def test_price_filter(self):
        make_product(name="Cheap", slug="cheap-oil", price="100.00", mrp="120.00")
        make_product(name="Expensive", slug="expensive-oil", price="900.00", mrp="1000.00")
        response = self.client.get("/api/v1/products/?max_price=200")
        names = [p["name"] for p in response.data["results"]]
        self.assertIn("Cheap", names)
        self.assertNotIn("Expensive", names)
