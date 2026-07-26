from django.conf import settings
from django.db import models

from apps.core.models import BaseModel


class Order(BaseModel):
    PENDING_PAYMENT = "pending_payment"
    CONFIRMED = "confirmed"
    PACKED = "packed"
    SHIPPED = "shipped"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    PAYMENT_FAILED = "payment_failed"
    REFUNDED = "refunded"
    STATUS_CHOICES = [
        (PENDING_PAYMENT, "Pending payment"),
        (CONFIRMED, "Confirmed"),
        (PACKED, "Packed"),
        (SHIPPED, "Shipped"),
        (OUT_FOR_DELIVERY, "Out for delivery"),
        (DELIVERED, "Delivered"),
        (CANCELLED, "Cancelled"),
        (PAYMENT_FAILED, "Payment failed"),
        (REFUNDED, "Refunded"),
    ]

    COD = "cod"
    ONLINE = "online"
    PAYMENT_METHOD_CHOICES = [(COD, "Cash on delivery"), (ONLINE, "Online payment")]

    order_number = models.CharField(max_length=20, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="orders")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING_PAYMENT)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES)

    idempotency_key = models.CharField(max_length=100, unique=True)

    shipping_full_name = models.CharField(max_length=150)
    shipping_phone = models.CharField(max_length=20)
    shipping_line1 = models.CharField(max_length=255)
    shipping_line2 = models.CharField(max_length=255, blank=True)
    shipping_city = models.CharField(max_length=100)
    shipping_state = models.CharField(max_length=100)
    shipping_pincode = models.CharField(max_length=10)
    shipping_country = models.CharField(max_length=100, default="India")

    billing_same_as_shipping = models.BooleanField(default=True)
    billing_full_name = models.CharField(max_length=150, blank=True)
    billing_phone = models.CharField(max_length=20, blank=True)
    billing_line1 = models.CharField(max_length=255, blank=True)
    billing_line2 = models.CharField(max_length=255, blank=True)
    billing_city = models.CharField(max_length=100, blank=True)
    billing_state = models.CharField(max_length=100, blank=True)
    billing_pincode = models.CharField(max_length=10, blank=True)

    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    discount_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    coupon_code = models.CharField(max_length=50, blank=True)

    placed_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancellation_reason = models.CharField(max_length=255, blank=True)
    reservation_expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "orders_order"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["order_number"]), models.Index(fields=["status"])]

    def __str__(self):
        return self.order_number

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self._generate_order_number()
        super().save(*args, **kwargs)

    @staticmethod
    def _generate_order_number():
        import random
        import string

        from django.utils import timezone

        stamp = timezone.now().strftime("%y%m%d")
        suffix = "".join(random.choices(string.digits, k=5))
        candidate = f"EKAS{stamp}{suffix}"
        while Order.objects.filter(order_number=candidate).exists():
            suffix = "".join(random.choices(string.digits, k=5))
            candidate = f"EKAS{stamp}{suffix}"
        return candidate


class OrderItem(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    variant = models.ForeignKey("catalog.ProductVariant", on_delete=models.PROTECT, related_name="order_items")
    bundle = models.ForeignKey(
        "catalog.Bundle", null=True, blank=True, on_delete=models.SET_NULL, related_name="order_items"
    )
    product_name = models.CharField(max_length=200)
    variant_label = models.CharField(max_length=100)
    sku = models.CharField(max_length=64)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    line_total = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        db_table = "orders_order_item"


class OrderStatusHistory(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="status_history")
    from_status = models.CharField(max_length=20, blank=True)
    to_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="+"
    )
    note = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "orders_status_history"
        ordering = ["created_at"]
        verbose_name_plural = "Order status histories"


class InternalOrderNote(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="internal_notes")
    staff = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="+")
    note = models.TextField()

    class Meta:
        db_table = "orders_internal_note"
        ordering = ["-created_at"]


class CancellationRequest(BaseModel):
    REQUESTED = "requested"
    APPROVED = "approved"
    REJECTED = "rejected"
    STATUS_CHOICES = [(REQUESTED, "Requested"), (APPROVED, "Approved"), (REJECTED, "Rejected")]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="cancellation_requests")
    requested_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="+")
    reason = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=REQUESTED)
    resolved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="+"
    )
    resolved_at = models.DateTimeField(null=True, blank=True)
    staff_note = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "orders_cancellation_request"
        ordering = ["-created_at"]
