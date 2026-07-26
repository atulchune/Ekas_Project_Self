import uuid

from django.conf import settings
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class BaseModel(UUIDModel, TimeStampedModel):
    """Standard base for domain models: UUID pk + created/updated timestamps."""

    class Meta:
        abstract = True


class TrackedModel(BaseModel):
    """Adds creator/updater tracking for staff-editable content."""

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    class Meta:
        abstract = True


class PublishableModel(models.Model):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    ARCHIVED = "archived"
    STATUS_CHOICES = [
        (DRAFT, "Draft"),
        (SCHEDULED, "Scheduled"),
        (PUBLISHED, "Published"),
        (ARCHIVED, "Archived"),
    ]

    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=DRAFT)
    publish_at = models.DateTimeField(null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True
