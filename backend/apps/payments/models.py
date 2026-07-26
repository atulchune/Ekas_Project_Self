from django.conf import settings
from django.db import models

from apps.core.models import BaseModel


class Payment(BaseModel):
    CREATED = "created"
    AUTHORIZED = "authorized"
    CAPTURED = "captured"
    FAILED = "failed"
    REFUNDED = "refunded"
    STATUS_CHOICES = [
        (CREATED, "Created"),
        (AUTHORIZED, "Authorized"),
        (CAPTURED, "Captured"),
        (FAILED, "Failed"),
        (REFUNDED, "Refunded"),
    ]

    MOCK = "mock"
    RAZORPAY = "razorpay"
    COD = "cod"
    PROVIDER_CHOICES = [(MOCK, "Mock"), (RAZORPAY, "Razorpay"), (COD, "Cash on delivery")]

    order = models.ForeignKey("orders.Order", on_delete=models.CASCADE, related_name="payments")
    provider = models.CharField(max_length=10, choices=PROVIDER_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=CREATED)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    provider_order_id = models.CharField(max_length=100, blank=True)
    provider_payment_id = models.CharField(max_length=100, blank=True, unique=True, null=True)
    provider_signature = models.CharField(max_length=255, blank=True)
    failure_reason = models.CharField(max_length=255, blank=True)
    raw_response = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = "payments_payment"
        ordering = ["-created_at"]


class WebhookEvent(BaseModel):
    """Every inbound webhook is logged by its provider event id before
    processing, so a replayed/duplicated delivery is a no-op."""

    provider = models.CharField(max_length=10)
    event_id = models.CharField(max_length=150, unique=True)
    event_type = models.CharField(max_length=100)
    payload = models.JSONField(default=dict)
    processed = models.BooleanField(default=False)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "payments_webhook_event"


class Refund(BaseModel):
    REQUESTED = "requested"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    STATUS_CHOICES = [
        (REQUESTED, "Requested"),
        (PROCESSING, "Processing"),
        (COMPLETED, "Completed"),
        (FAILED, "Failed"),
    ]

    payment = models.ForeignKey(Payment, null=True, blank=True, on_delete=models.CASCADE, related_name="refunds")
    order = models.ForeignKey("orders.Order", on_delete=models.CASCADE, related_name="refunds")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    reason = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default=REQUESTED)
    provider_refund_id = models.CharField(max_length=100, blank=True)
    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="+"
    )
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "payments_refund"
        ordering = ["-created_at"]
