from django.conf import settings
from django.db import models

from apps.core.models import BaseModel


class Cart(BaseModel):
    ACTIVE = "active"
    MERGED = "merged"
    CONVERTED = "converted"
    STATUS_CHOICES = [(ACTIVE, "Active"), (MERGED, "Merged"), (CONVERTED, "Converted")]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE, related_name="cart"
    )
    guest_token = models.CharField(max_length=64, unique=True, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=ACTIVE)
    coupon_code = models.CharField(max_length=50, blank=True)
    abandoned_reminder_sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "cart_cart"

    def __str__(self):
        return f"Cart({self.user_id or self.guest_token})"


class CartItem(BaseModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    variant = models.ForeignKey("catalog.ProductVariant", on_delete=models.CASCADE, related_name="cart_items")
    bundle = models.ForeignKey(
        "catalog.Bundle", null=True, blank=True, on_delete=models.CASCADE, related_name="cart_items"
    )
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = "cart_item"
        unique_together = ("cart", "variant", "bundle")
        ordering = ["created_at"]


class Wishlist(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wishlist_items")
    product = models.ForeignKey("catalog.Product", on_delete=models.CASCADE, related_name="+")

    class Meta:
        db_table = "cart_wishlist"
        unique_together = ("user", "product")
        ordering = ["-created_at"]


class RecentlyViewed(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE, related_name="recently_viewed"
    )
    guest_token = models.CharField(max_length=64, null=True, blank=True)
    product = models.ForeignKey("catalog.Product", on_delete=models.CASCADE, related_name="+")
    viewed_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "cart_recently_viewed"
        ordering = ["-viewed_at"]


class StockNotification(BaseModel):
    email = models.EmailField()
    variant = models.ForeignKey("catalog.ProductVariant", on_delete=models.CASCADE, related_name="notify_requests")
    notified_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "cart_stock_notification"
        unique_together = ("email", "variant")
