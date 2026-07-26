from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.engagement.models import ContactEnquiry, EnquiryNote, NewsletterSubscriber, NotificationLog
from apps.engagement.tasks import send_newsletter_campaign

from .audit import log_action
from .base import OperationsModelViewSet
from .permissions import HasOperationsPermission, IsOperationsStaff


class NotificationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationLog
        fields = "__all__"


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = "__all__"


class EnquiryNoteSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source="staff.full_name", read_only=True)

    class Meta:
        model = EnquiryNote
        fields = "__all__"
        read_only_fields = ["staff"]


class ContactEnquiryOpsSerializer(serializers.ModelSerializer):
    notes = EnquiryNoteSerializer(many=True, read_only=True)
    assigned_to_email = serializers.CharField(source="assigned_to.email", read_only=True, default=None)

    class Meta:
        model = ContactEnquiry
        fields = "__all__"


class NotificationLogOpsViewSet(OperationsModelViewSet):
    queryset = NotificationLog.objects.all()
    serializer_class = NotificationLogSerializer
    resource_type = "notification_log"
    view_permission_code = "notifications.view"
    manage_permission_code = "notifications.view"
    http_method_names = ["get", "head", "options"]
    filterset_fields = ["channel", "status", "template_code"]


class NewsletterSubscriberOpsViewSet(OperationsModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    resource_type = "newsletter_subscriber"
    view_permission_code = "newsletter.view"
    manage_permission_code = "newsletter.manage"
    http_method_names = ["get", "delete", "head", "options"]
    filterset_fields = ["is_active"]
    search_fields = ["email"]


class NewsletterCampaignView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "newsletter.manage"

    def post(self, request):
        subject = request.data.get("subject")
        body = request.data.get("body")
        task = send_newsletter_campaign.delay(subject=subject, body=body)
        log_action(staff=request.user, action="send_campaign", resource_type="newsletter", new_value={"subject": subject}, request=request)
        return Response({"status": "queued", "task_id": task.id})


class ContactEnquiryOpsViewSet(OperationsModelViewSet):
    queryset = ContactEnquiry.objects.select_related("assigned_to").prefetch_related("notes").all()
    serializer_class = ContactEnquiryOpsSerializer
    resource_type = "contact_enquiry"
    view_permission_code = "enquiries.view"
    manage_permission_code = "enquiries.manage"
    http_method_names = ["get", "patch", "head", "options"]
    filterset_fields = ["status", "assigned_to"]
    search_fields = ["name", "email", "message"]


class EnquiryNoteOpsViewSet(OperationsModelViewSet):
    queryset = EnquiryNote.objects.select_related("staff").all()
    serializer_class = EnquiryNoteSerializer
    resource_type = "enquiry_note"
    view_permission_code = "enquiries.view"
    manage_permission_code = "enquiries.manage"
    filterset_fields = ["enquiry"]

    def perform_create(self, serializer):
        instance = serializer.save(staff=self.request.user)
        log_action(staff=self.request.user, action="create", resource_type="enquiry_note", resource_id=instance.pk, request=self.request)
