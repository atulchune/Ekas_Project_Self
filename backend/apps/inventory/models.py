from django.conf import settings
from django.db import models

from apps.core.models import BaseModel


class Inventory(BaseModel):
    variant = models.OneToOneField(
        "catalog.ProductVariant", on_delete=models.CASCADE, related_name="inventory"
    )
    on_hand_quantity = models.IntegerField(default=0, help_text="Physically in the warehouse")
    reserved_quantity = models.IntegerField(default=0, help_text="Held for unpaid/processing orders")
    sold_quantity = models.IntegerField(default=0, help_text="Lifetime units sold, for reporting")
    low_stock_threshold = models.PositiveIntegerField(default=10)

    class Meta:
        db_table = "inventory_inventory"
        ordering = ["-created_at"]

    @property
    def available_quantity(self):
        return max(self.on_hand_quantity - self.reserved_quantity, 0)

    def __str__(self):
        return f"{self.variant.sku}: {self.available_quantity} available"


class InventoryMovement(BaseModel):
    RESTOCK = "restock"
    ADJUSTMENT = "adjustment"
    RESERVATION = "reservation"
    RESERVATION_RELEASE = "reservation_release"
    SALE = "sale"
    RETURN = "return"
    MOVEMENT_TYPE_CHOICES = [
        (RESTOCK, "Restock"),
        (ADJUSTMENT, "Manual adjustment"),
        (RESERVATION, "Reservation"),
        (RESERVATION_RELEASE, "Reservation release"),
        (SALE, "Sale"),
        (RETURN, "Return"),
    ]

    variant = models.ForeignKey(
        "catalog.ProductVariant", on_delete=models.CASCADE, related_name="movements"
    )
    movement_type = models.CharField(max_length=25, choices=MOVEMENT_TYPE_CHOICES)
    on_hand_delta = models.IntegerField(default=0)
    reserved_delta = models.IntegerField(default=0)
    reason = models.CharField(max_length=255, blank=True)
    order = models.ForeignKey(
        "orders.Order", null=True, blank=True, on_delete=models.SET_NULL, related_name="inventory_movements"
    )
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="+"
    )
    resulting_on_hand = models.IntegerField()
    resulting_reserved = models.IntegerField()

    class Meta:
        db_table = "inventory_movement"
        ordering = ["-created_at"]
