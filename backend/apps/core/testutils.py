from decimal import Decimal

from django.core.cache import cache
from django.test import TestCase

from apps.catalog.models import Category, Product, ProductVariant
from apps.inventory.models import Inventory


class BaseAPITestCase(TestCase):
    """Clears the shared Redis-backed cache before each test so DRF's
    scoped request throttling (which reads/writes real Redis, not the
    per-test DB transaction) can't leak state between test cases."""

    def setUp(self):
        super().setUp()
        cache.clear()


def make_product(
    name="Wood-Pressed Coconut Oil", slug="wood-pressed-coconut-oil", price="299.00", mrp="349.00",
    stock=50, category_name="Wood-Pressed Oils", sku=None,
):
    category, _ = Category.objects.get_or_create(slug=category_name.lower().replace(" ", "-"), defaults={"name": category_name})
    product = Product.objects.create(
        category=category, name=name, slug=slug, short_description="Test product", status=Product.PUBLISHED,
    )
    variant = ProductVariant.objects.create(
        product=product, sku=sku or f"{slug.upper()}-500", label="500ml", weight_grams=500,
        price=Decimal(price), mrp=Decimal(mrp), is_default=True,
    )
    Inventory.objects.create(variant=variant, on_hand_quantity=stock, low_stock_threshold=5)
    return product, variant
