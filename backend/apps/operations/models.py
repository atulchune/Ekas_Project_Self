from django.conf import settings
from django.db import models

from apps.core.models import BaseModel, TimeStampedModel


class Permission(models.Model):
    code = models.CharField(max_length=100, unique=True)
    module = models.CharField(max_length=50)
    description = models.CharField(max_length=200, blank=True)

    class Meta:
        db_table = "operations_permission"
        ordering = ["module", "code"]

    def __str__(self):
        return self.code


class Role(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=255, blank=True)
    is_system = models.BooleanField(default=False, help_text="Seeded default role; cannot be deleted")
    permissions = models.ManyToManyField(Permission, through="RolePermission", related_name="roles")

    class Meta:
        db_table = "operations_role"

    def __str__(self):
        return self.name


class RolePermission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)

    class Meta:
        db_table = "operations_role_permission"
        unique_together = ("role", "permission")


class StaffProfile(BaseModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="staff_profile")
    job_title = models.CharField(max_length=100, blank=True)
    employee_id = models.CharField(max_length=50, blank=True)
    roles = models.ManyToManyField(Role, through="StaffRole", related_name="staff_members")
    receives_low_stock_alerts = models.BooleanField(default=True)
    is_super_admin = models.BooleanField(default=False)

    class Meta:
        db_table = "operations_staff_profile"

    def __str__(self):
        return self.user.email

    def has_permission(self, code):
        if self.is_super_admin or self.user.is_superuser:
            return True
        return Permission.objects.filter(code=code, roles__staff_members=self).exists()

    def permission_codes(self):
        if self.is_super_admin or self.user.is_superuser:
            return list(Permission.objects.values_list("code", flat=True))
        return list(Permission.objects.filter(roles__staff_members=self).values_list("code", flat=True).distinct())


class StaffRole(BaseModel):
    staff = models.ForeignKey(StaffProfile, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="+"
    )

    class Meta:
        db_table = "operations_staff_role"
        unique_together = ("staff", "role")


class StaffSession(BaseModel):
    staff = models.ForeignKey(StaffProfile, on_delete=models.CASCADE, related_name="sessions")
    refresh_jti = models.CharField(max_length=64, unique=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, blank=True)
    last_seen_at = models.DateTimeField(auto_now=True)
    revoked_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "operations_staff_session"
        ordering = ["-last_seen_at"]

    @property
    def is_active(self):
        return self.revoked_at is None


class AuditLog(BaseModel):
    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="audit_logs"
    )
    action = models.CharField(max_length=50)
    resource_type = models.CharField(max_length=100)
    resource_id = models.CharField(max_length=64, blank=True)
    previous_value = models.JSONField(default=dict, blank=True)
    new_value = models.JSONField(default=dict, blank=True)
    request_id = models.CharField(max_length=64, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "operations_audit_log"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["resource_type", "resource_id"])]


class StoreSetting(TimeStampedModel):
    key = models.CharField(max_length=100, unique=True)
    value = models.JSONField(default=dict, blank=True)
    description = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "operations_store_setting"

    def __str__(self):
        return self.key


class ReportExport(BaseModel):
    PENDING = "pending"
    READY = "ready"
    FAILED = "failed"
    STATUS_CHOICES = [(PENDING, "Pending"), (READY, "Ready"), (FAILED, "Failed")]

    requested_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="report_exports")
    report_type = models.CharField(max_length=50)
    filters = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    file = models.FileField(upload_to="reports/", blank=True, null=True)

    class Meta:
        db_table = "operations_report_export"
        ordering = ["-created_at"]
