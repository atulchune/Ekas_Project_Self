from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.core.testutils import BaseAPITestCase, make_product
from apps.operations.models import Permission, Role, StaffProfile, StaffRole


class OperationsRBACTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.client = APIClient()

        self.super_admin = User.objects.create_user(email="super@ekas.local", password="StrongPass123!", is_staff=True)
        StaffProfile.objects.create(user=self.super_admin, is_super_admin=True)

        self.limited_staff = User.objects.create_user(email="support@ekas.local", password="StrongPass123!", is_staff=True)
        limited_profile = StaffProfile.objects.create(user=self.limited_staff)
        view_only_role = Role.objects.create(name="Customer Support Test")
        perm, _ = Permission.objects.get_or_create(code="customers.view", defaults={"module": "customers"})
        StaffRole.objects.create(staff=limited_profile, role=view_only_role)
        view_only_role.permissions.add(perm)

        self.product, self.variant = make_product()

    def test_non_staff_user_is_rejected(self):
        User.objects.create_user(email="shopper@example.com", password="StrongPass123!")
        self.client.post("/api/v1/operations/auth/login/", {"email": "shopper@example.com", "password": "StrongPass123!"}, format="json")
        response = self.client.get("/api/v1/operations/dashboard/")
        self.assertEqual(response.status_code, 401)

    def test_staff_without_products_permission_is_forbidden(self):
        self.client.post("/api/v1/operations/auth/login/", {"email": "support@ekas.local", "password": "StrongPass123!"}, format="json")
        response = self.client.patch(
            f"/api/v1/operations/products/{self.product.id}/", {"name": "Hacked Name"}, format="json"
        )
        self.assertEqual(response.status_code, 403)

    def test_super_admin_can_manage_products(self):
        self.client.post("/api/v1/operations/auth/login/", {"email": "super@ekas.local", "password": "StrongPass123!"}, format="json")
        response = self.client.patch(
            f"/api/v1/operations/products/{self.product.id}/", {"name": "Updated Name"}, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.product.refresh_from_db()
        self.assertEqual(self.product.name, "Updated Name")

    def test_product_update_writes_audit_log(self):
        from apps.operations.models import AuditLog

        self.client.post("/api/v1/operations/auth/login/", {"email": "super@ekas.local", "password": "StrongPass123!"}, format="json")
        self.client.patch(f"/api/v1/operations/products/{self.product.id}/", {"name": "Audited Name"}, format="json")
        self.assertTrue(
            AuditLog.objects.filter(resource_type="product", resource_id=str(self.product.id), action="update").exists()
        )

    def test_force_logout_revokes_session(self):
        self.client.post("/api/v1/operations/auth/login/", {"email": "support@ekas.local", "password": "StrongPass123!"}, format="json")
        self.client.post("/api/v1/operations/auth/login/", {"email": "super@ekas.local", "password": "StrongPass123!"}, format="json")

        limited_profile = StaffProfile.objects.get(user=self.limited_staff)
        response = self.client.post(f"/api/v1/operations/staff/{limited_profile.id}/force-logout/", format="json")
        self.assertEqual(response.status_code, 200)
        from apps.operations.models import StaffSession

        self.assertFalse(StaffSession.objects.filter(staff=limited_profile, revoked_at__isnull=True).exists())
