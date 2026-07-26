from django.conf import settings
from django.db import models

from apps.core.models import PublishableModel, TrackedModel


class Category(TrackedModel):
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE, related_name="children")
    image = models.ImageField(upload_to="categories/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.CharField(max_length=300, blank=True)

    class Meta:
        db_table = "catalog_category"
        ordering = ["display_order", "name"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Product(TrackedModel, PublishableModel):
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    short_description = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)

    source = models.TextField(blank=True, help_text="Where/how the raw ingredient is sourced")
    ingredients = models.TextField(blank=True)
    preparation = models.TextField(blank=True, help_text="Traditional preparation method")
    aroma_texture = models.TextField(blank=True)
    culinary_uses = models.TextField(blank=True)
    storage_instructions = models.TextField(blank=True)
    shelf_life = models.CharField(max_length=100, blank=True)
    allergens = models.CharField(max_length=255, blank=True)
    nutrition_info = models.JSONField(default=dict, blank=True)
    certifications = models.JSONField(default=list, blank=True)

    is_featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    is_new_launch = models.BooleanField(default=False)

    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.PositiveIntegerField(default=0)

    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.CharField(max_length=300, blank=True)

    related_products = models.ManyToManyField("self", blank=True, symmetrical=True)

    class Meta:
        db_table = "catalog_product"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["status"]),
            models.Index(fields=["is_featured", "is_bestseller", "is_new_launch"]),
        ]

    def __str__(self):
        return self.name


class ProductVariant(TrackedModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    sku = models.CharField(max_length=64, unique=True)
    label = models.CharField(max_length=100, help_text="e.g. 500ml, 1L, 250g")
    weight_grams = models.PositiveIntegerField(null=True, blank=True)
    dimensions = models.CharField(max_length=100, blank=True, help_text="LxWxH cm")

    price = models.DecimalField(max_digits=10, decimal_places=2)
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "catalog_product_variant"
        ordering = ["display_order"]

    def __str__(self):
        return f"{self.product.name} - {self.label}"

    @property
    def savings_amount(self):
        return max(self.mrp - self.price, 0)

    @property
    def savings_percent(self):
        if self.mrp <= 0:
            return 0
        return round((self.savings_amount / self.mrp) * 100)


class ProductImage(TrackedModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    variant = models.ForeignKey(
        ProductVariant, null=True, blank=True, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="products/")
    alt_text = models.CharField(max_length=200, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_primary = models.BooleanField(default=False)

    class Meta:
        db_table = "catalog_product_image"
        ordering = ["display_order"]


class ProductVideo(TrackedModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="videos")
    video = models.FileField(upload_to="products/videos/", blank=True, null=True)
    video_url = models.URLField(blank=True, help_text="External URL if not self-hosted")
    thumbnail = models.ImageField(upload_to="products/video-thumbs/", blank=True, null=True)
    title = models.CharField(max_length=200, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "catalog_product_video"
        ordering = ["display_order"]


class Bundle(TrackedModel, PublishableModel):
    """A combo pack: a curated set of products/variants sold at a bundle price."""

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="bundles/", blank=True, null=True)
    bundle_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "catalog_bundle"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    @property
    def items_mrp_total(self):
        return sum((item.variant.mrp * item.quantity for item in self.items.select_related("variant")), start=0)


class BundleItem(models.Model):
    bundle = models.ForeignKey(Bundle, on_delete=models.CASCADE, related_name="items")
    variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT, related_name="bundle_items")
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = "catalog_bundle_item"
        unique_together = ("bundle", "variant")
