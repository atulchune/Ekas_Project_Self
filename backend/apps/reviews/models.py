from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.core.models import BaseModel


class Review(BaseModel):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    STATUS_CHOICES = [(PENDING, "Pending"), (APPROVED, "Approved"), (REJECTED, "Rejected")]

    product = models.ForeignKey("catalog.Product", on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews")
    order_item = models.ForeignKey(
        "orders.OrderItem", null=True, blank=True, on_delete=models.SET_NULL, related_name="+"
    )
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=150, blank=True)
    body = models.TextField(blank=True)
    is_verified_purchase = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    staff_reply = models.TextField(blank=True)
    staff_reply_at = models.DateTimeField(null=True, blank=True)
    reported_count = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "reviews_review"
        ordering = ["-created_at"]
        unique_together = ("product", "user", "order_item")


class ReviewMedia(BaseModel):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name="media")
    image = models.ImageField(upload_to="reviews/", blank=True, null=True)
    video = models.FileField(upload_to="reviews/videos/", blank=True, null=True)

    class Meta:
        db_table = "reviews_review_media"
