from django.conf import settings
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.core.testutils import BaseAPITestCase


class RegisterLoginTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.client = APIClient()

    def test_register_sets_httponly_cookies_and_creates_profile(self):
        response = self.client.post(
            "/api/v1/auth/register/",
            {"email": "jane@example.com", "password": "StrongPass123!", "first_name": "Jane"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertIn(settings.CUSTOMER_ACCESS_COOKIE, response.cookies)
        self.assertTrue(response.cookies[settings.CUSTOMER_ACCESS_COOKIE]["httponly"])
        self.assertTrue(User.objects.filter(email="jane@example.com").exists())

    def test_login_with_wrong_password_fails_and_locks_after_threshold(self):
        User.objects.create_user(email="lockme@example.com", password="CorrectHorse1!")
        for _ in range(settings.LOGIN_LOCKOUT_ATTEMPTS):
            response = self.client.post(
                "/api/v1/auth/login/", {"email": "lockme@example.com", "password": "wrong"}, format="json"
            )
        self.assertEqual(response.status_code, 401)
        # One more attempt (even with the correct password) should now be locked out.
        response = self.client.post(
            "/api/v1/auth/login/", {"email": "lockme@example.com", "password": "CorrectHorse1!"}, format="json"
        )
        self.assertEqual(response.status_code, 423)

    def test_me_requires_authentication(self):
        response = self.client.get("/api/v1/auth/me/")
        self.assertEqual(response.status_code, 401)

    def test_login_then_access_me(self):
        User.objects.create_user(email="ok@example.com", password="StrongPass123!")
        login = self.client.post("/api/v1/auth/login/", {"email": "ok@example.com", "password": "StrongPass123!"}, format="json")
        self.assertEqual(login.status_code, 200)
        me = self.client.get("/api/v1/auth/me/")
        self.assertEqual(me.status_code, 200)
        self.assertEqual(me.data["user"]["email"], "ok@example.com")
