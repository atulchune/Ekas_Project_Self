from rest_framework import serializers

from .base import OperationsModelViewSet
from .models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    staff_email = serializers.CharField(source="staff.email", read_only=True, default=None)

    class Meta:
        model = AuditLog
        fields = "__all__"


class AuditLogViewSet(OperationsModelViewSet):
    queryset = AuditLog.objects.select_related("staff").all()
    serializer_class = AuditLogSerializer
    resource_type = "audit_log"
    view_permission_code = "audit.view"
    manage_permission_code = "audit.view"
    http_method_names = ["get", "head", "options"]
    filterset_fields = ["action", "resource_type", "staff"]
    search_fields = ["resource_type", "resource_id", "action"]
