from django.db import models

from apps.core.models import BaseModel, TrackedModel


class ServiceablePincode(BaseModel):
    pincode = models.CharField(max_length=10, unique=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    cod_available = models.BooleanField(default=True)
    is_serviceable = models.BooleanField(default=True)
    estimated_days = models.PositiveIntegerField(default=4)

    class Meta:
        db_table = "shipping_serviceable_pincode"

    def __str__(self):
        return self.pincode


class Shipment(TrackedModel):
    PENDING = "pending"
    PACKED = "packed"
    SHIPPED = "shipped"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    FAILED = "failed"
    RETURNED = "returned"
    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (PACKED, "Packed"),
        (SHIPPED, "Shipped"),
        (OUT_FOR_DELIVERY, "Out for delivery"),
        (DELIVERED, "Delivered"),
        (FAILED, "Delivery failed"),
        (RETURNED, "Returned"),
    ]

    order = models.OneToOneField("orders.Order", on_delete=models.CASCADE, related_name="shipment")
    courier_name = models.CharField(max_length=100, blank=True)
    tracking_number = models.CharField(max_length=100, blank=True)
    tracking_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)
    packed_at = models.DateTimeField(null=True, blank=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "shipping_shipment"
