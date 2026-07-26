from django.utils import timezone
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User

from .audit import log_action
from .base import OperationsModelViewSet
from .models import Permission, Role, StaffProfile, StaffRole, StaffSession
from .permissions import HasOperationsPermission, IsOperationsStaff


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = "__all__"


class RoleSerializer(serializers.ModelSerializer):
    permission_codes = serializers.SlugRelatedField(
        source="permissions", slug_field="code", many=True, read_only=True
    )

    class Meta:
        model = Role
        fields = ["id", "name", "description", "is_system", "permission_codes", "created_at"]


class RoleWriteSerializer(serializers.ModelSerializer):
    permission_codes = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)

    class Meta:
        model = Role
        fields = ["id", "name", "description", "permission_codes"]

    def create(self, validated_data):
        codes = validated_data.pop("permission_codes", [])
        role = Role.objects.create(**validated_data)
        role.permissions.set(Permission.objects.filter(code__in=codes))
        return role

    def update(self, instance, validated_data):
        codes = validated_data.pop("permission_codes", None)
        instance = super().update(instance, validated_data)
        if codes is not None:
            instance.permissions.set(Permission.objects.filter(code__in=codes))
        return instance


class RoleOpsViewSet(OperationsModelViewSet):
    queryset = Role.objects.prefetch_related("permissions").all()
    resource_type = "role"
    view_permission_code = "roles.view"
    manage_permission_code = "roles.manage"

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return RoleWriteSerializer
        return RoleSerializer

    def perform_destroy(self, instance):
        from apps.core.exceptions import ApplicationError

        if instance.is_system:
            raise ApplicationError("System roles cannot be deleted.", code="system_role_protected", status_code=409)
        super().perform_destroy(instance)


class PermissionListView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "roles.view"

    def get(self, request):
        return Response(PermissionSerializer(Permission.objects.all(), many=True).data)


class StaffMemberSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email")
    full_name = serializers.CharField(source="user.full_name", read_only=True)
    is_active = serializers.BooleanField(source="user.is_active", read_only=True)
    role_names = serializers.SlugRelatedField(source="roles", slug_field="name", many=True, read_only=True)
    role_ids = serializers.PrimaryKeyRelatedField(source="roles", many=True, read_only=True)

    class Meta:
        model = StaffProfile
        fields = [
            "id", "email", "full_name", "is_active", "job_title", "employee_id",
            "role_names", "role_ids", "is_super_admin", "receives_low_stock_alerts",
        ]


class StaffOpsViewSet(OperationsModelViewSet):
    queryset = StaffProfile.objects.select_related("user").prefetch_related("roles").all()
    serializer_class = StaffMemberSerializer
    resource_type = "staff"
    view_permission_code = "staff.view"
    manage_permission_code = "staff.manage"
    http_method_names = ["get", "patch", "head", "options"]
    search_fields = ["user__email", "job_title"]


class InviteStaffView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "staff.manage"

    def post(self, request):
        import secrets

        email = request.data.get("email", "").lower()
        job_title = request.data.get("job_title", "")
        role_ids = request.data.get("role_ids", [])
        if User.objects.filter(email=email).exists():
            from apps.core.exceptions import ApplicationError

            raise ApplicationError("A user with this email already exists.", code="user_exists", status_code=400)

        temp_password = secrets.token_urlsafe(12)
        user = User.objects.create_user(email=email, password=temp_password, is_staff=True, email_verified=True)
        profile = StaffProfile.objects.create(user=user, job_title=job_title)
        for role in Role.objects.filter(pk__in=role_ids):
            StaffRole.objects.create(staff=profile, role=role, assigned_by=request.user)

        from apps.accounts.tasks import send_transactional_email

        send_transactional_email.delay(
            user_id=str(user.id), to_email=email, subject="You've been invited to EKAS Operations Portal",
            body=f"An account has been created for you.\n\nEmail: {email}\nTemporary password: {temp_password}\n\nLog in at /operations and change your password immediately.",
            template_code="staff_invite",
        )
        log_action(staff=request.user, action="invite", resource_type="staff", resource_id=str(profile.pk), new_value={"email": email}, request=request)
        return Response(StaffMemberSerializer(profile).data, status=201)


class StaffDeactivateView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "staff.manage"

    def post(self, request, pk):
        profile = StaffProfile.objects.select_related("user").get(pk=pk)
        active = bool(request.data.get("is_active", False))
        profile.user.is_active = active
        profile.user.save(update_fields=["is_active"])
        if not active:
            StaffSession.objects.filter(staff=profile, revoked_at__isnull=True).update(revoked_at=timezone.now())
        log_action(
            staff=request.user, action="deactivate" if not active else "reactivate", resource_type="staff",
            resource_id=str(profile.pk), new_value={"is_active": active}, request=request,
        )
        return Response(StaffMemberSerializer(profile).data)


class StaffAssignRolesView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "staff.manage"

    def post(self, request, pk):
        profile = StaffProfile.objects.get(pk=pk)
        role_ids = request.data.get("role_ids", [])
        StaffRole.objects.filter(staff=profile).delete()
        for role in Role.objects.filter(pk__in=role_ids):
            StaffRole.objects.create(staff=profile, role=role, assigned_by=request.user)
        log_action(staff=request.user, action="assign_roles", resource_type="staff", resource_id=str(profile.pk), new_value={"role_ids": role_ids}, request=request)
        return Response(StaffMemberSerializer(profile).data)


class StaffForceLogoutView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "staff.manage"

    def post(self, request, pk):
        profile = StaffProfile.objects.get(pk=pk)
        count = StaffSession.objects.filter(staff=profile, revoked_at__isnull=True).update(revoked_at=timezone.now())
        log_action(staff=request.user, action="force_logout", resource_type="staff", resource_id=str(profile.pk), new_value={"sessions_revoked": count}, request=request)
        return Response({"status": "sessions_revoked", "count": count})
