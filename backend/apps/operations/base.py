from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination

from .audit import log_action
from .permissions import HasOperationsPermission, IsOperationsStaff


class OperationsPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = "page_size"
    max_page_size = 200


def _model_to_dict(instance, fields):
    from django.forms.models import model_to_dict

    try:
        return model_to_dict(instance, fields=fields)
    except Exception:
        return {}


class OperationsModelViewSet(viewsets.ModelViewSet):
    """Base for every Operations Portal CRUD endpoint: staff-only auth,
    per-action permission codes, server pagination, and an immutable audit
    trail entry on every create/update/delete."""

    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    pagination_class = OperationsPagination
    resource_type = "resource"
    view_permission_code = None
    manage_permission_code = None
    audit_fields = None

    def get_required_permission_code(self):
        if self.action in ("list", "retrieve"):
            return self.view_permission_code or self.manage_permission_code
        return self.manage_permission_code

    def _snapshot(self, instance):
        if not instance:
            return {}
        return _model_to_dict(instance, self.audit_fields) if self.audit_fields else {"id": str(instance.pk)}

    def perform_create(self, serializer):
        instance = serializer.save()
        log_action(
            staff=self.request.user, action="create", resource_type=self.resource_type,
            resource_id=instance.pk, new_value=self._snapshot(instance), request=self.request,
        )

    def perform_update(self, serializer):
        before = self._snapshot(serializer.instance)
        instance = serializer.save()
        log_action(
            staff=self.request.user, action="update", resource_type=self.resource_type,
            resource_id=instance.pk, previous_value=before, new_value=self._snapshot(instance), request=self.request,
        )

    def perform_destroy(self, instance):
        before = self._snapshot(instance)
        resource_id = instance.pk
        instance.delete()
        log_action(
            staff=self.request.user, action="delete", resource_type=self.resource_type,
            resource_id=resource_id, previous_value=before, request=self.request,
        )
