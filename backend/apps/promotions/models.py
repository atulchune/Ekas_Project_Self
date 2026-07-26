from django.conf import settings
from django.db import models

from apps.core.models import TrackedModel


class DiscountRuleBase(TrackedModel):
    FIXED = "fixed"
    PERCENTAGE = "percentage"
    DISCOUNT_TYPE_CHOICES = [(FIXED, "Fixed amount"), (PERCENTAGE, "Percentage")]

    ALL = "all"
    CATEGORY = "category"
    PRODUCT = "product"
    SCOPE_CHOICES = [(ALL, "Entire order"), (CATEGORY, "Specific categories"), (PRODUCT, "Specific products")]

    name = models.CharField(max_length=150)
    discount_type = models.CharField(max_length=12, choices=DISCOUNT_TYPE_CHOICES, default=PERCENTAGE)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    scope = models.CharField(max_length=10, choices=SCOPE_CHOICES, default=ALL)
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_discount_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    grants_free_shipping = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    stackable = models.BooleanField(default=False)
    priority = models.PositiveIntegerField(default=0, help_text="Higher applies first when not stackable")
    valid_from = models.DateTimeField(null=True, blank=True)
    valid_to = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True


class Coupon(DiscountRuleBase):
    code = models.CharField(max_length=50, unique=True)
    categories = models.ManyToManyField("catalog.Category", blank=True, related_name="+")
    products = models.ManyToManyField("catalog.Product", blank=True, related_name="+")
    usage_limit_total = models.PositiveIntegerField(null=True, blank=True)
    usage_limit_per_customer = models.PositiveIntegerField(null=True, blank=True, default=1)
    times_used = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "promotions_coupon"

    def __str__(self):
        return self.code


class Promotion(DiscountRuleBase):
    """Automatic promotions applied without a coupon code (e.g. festive sales)."""

    categories = models.ManyToManyField("catalog.Category", blank=True, related_name="+")
    products = models.ManyToManyField("catalog.Product", blank=True, related_name="+")

    class Meta:
        db_table = "promotions_promotion"

    def __str__(self):
        return self.name


class CouponUsage(TrackedModel):
    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE, related_name="usages")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="coupon_usages")
    order = models.ForeignKey("orders.Order", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "promotions_coupon_usage"
        ordering = ["-created_at"]
