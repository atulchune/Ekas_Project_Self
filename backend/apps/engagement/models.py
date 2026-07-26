from django.conf import settings
from django.db import models

from apps.core.models import BaseModel


class NotificationTemplate(BaseModel):
    EMAIL = "email"
    SMS = "sms"
    WHATSAPP = "whatsapp"
    CHANNEL_CHOICES = [(EMAIL, "Email"), (SMS, "SMS"), (WHATSAPP, "WhatsApp")]

    code = models.SlugField(max_length=100, unique=True)
    name = models.CharField(max_length=150)
    channel = models.CharField(max_length=10, choices=CHANNEL_CHOICES, default=EMAIL)
    subject = models.CharField(max_length=200, blank=True)
    body = models.TextField(help_text="Supports {{variable}} placeholders")
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "engagement_notification_template"

    def __str__(self):
        return self.code


class NotificationLog(BaseModel):
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"
    STATUS_CHOICES = [(PENDING, "Pending"), (SENT, "Sent"), (FAILED, "Failed")]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="notifications"
    )
    channel = models.CharField(max_length=10, choices=NotificationTemplate.CHANNEL_CHOICES)
    template_code = models.CharField(max_length=100, blank=True)
    recipient = models.CharField(max_length=255)
    subject = models.CharField(max_length=200, blank=True)
    body = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    error_message = models.TextField(blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "engagement_notification_log"
        ordering = ["-created_at"]


class NewsletterSubscriber(BaseModel):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    source = models.CharField(max_length=50, blank=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "engagement_newsletter_subscriber"

    def __str__(self):
        return self.email


class ContactEnquiry(BaseModel):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    STATUS_CHOICES = [(NEW, "New"), (IN_PROGRESS, "In progress"), (RESOLVED, "Resolved")]

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default=NEW)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="assigned_enquiries"
    )
    acknowledged_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "engagement_contact_enquiry"
        ordering = ["-created_at"]
        verbose_name_plural = "Contact enquiries"


class EnquiryNote(BaseModel):
    enquiry = models.ForeignKey(ContactEnquiry, on_delete=models.CASCADE, related_name="notes")
    staff = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="+")
    note = models.TextField()

    class Meta:
        db_table = "engagement_enquiry_note"
        ordering = ["created_at"]
