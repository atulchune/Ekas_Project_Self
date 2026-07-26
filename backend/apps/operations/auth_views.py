from django.conf import settings
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta

from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import LoginHistory, User
from apps.accounts.tokens import clear_auth_cookies, issue_tokens, set_auth_cookies
from apps.core.exceptions import ApplicationError

from .models import StaffProfile, StaffSession
from .permissions import IsOperationsStaff


def _client_ip(request):
    return request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", ""))[:45]


class StaffLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        email = (request.data.get("email") or "").lower()
        password = request.data.get("password") or ""

        user = User.objects.filter(email=email, is_staff=True).first()
        if user and user.locked_until and user.locked_until > timezone.now():
            raise ApplicationError("Too many failed attempts. Try again later.", code="account_locked", status_code=423)

        authenticated = authenticate(request, username=email, password=password) if user else None
        if not authenticated or not authenticated.is_staff:
            if user:
                user.failed_login_attempts += 1
                if user.failed_login_attempts >= settings.LOGIN_LOCKOUT_ATTEMPTS:
                    user.locked_until = timezone.now() + timedelta(minutes=settings.LOGIN_LOCKOUT_MINUTES)
                user.save(update_fields=["failed_login_attempts", "locked_until"])
                LoginHistory.objects.create(
                    user=user, ip_address=_client_ip(request), user_agent=request.META.get("HTTP_USER_AGENT", "")[:255],
                    success=False, reason="invalid_password",
                )
            raise ApplicationError("Invalid email or password.", code="invalid_credentials", status_code=401)

        if not authenticated.is_active:
            raise ApplicationError("This staff account has been deactivated.", code="account_disabled", status_code=403)

        profile, _ = StaffProfile.objects.get_or_create(user=authenticated)
        authenticated.failed_login_attempts = 0
        authenticated.locked_until = None
        authenticated.save(update_fields=["failed_login_attempts", "locked_until"])
        LoginHistory.objects.create(
            user=authenticated, ip_address=_client_ip(request),
            user_agent=request.META.get("HTTP_USER_AGENT", "")[:255], success=True,
        )

        access, refresh = issue_tokens(authenticated, "staff")
        refresh_jti = RefreshToken(refresh)["jti"]
        StaffSession.objects.create(
            staff=profile, refresh_jti=refresh_jti, ip_address=_client_ip(request),
            user_agent=request.META.get("HTTP_USER_AGENT", "")[:255],
        )

        response = Response(
            {
                "user": {"id": str(authenticated.id), "email": authenticated.email, "full_name": authenticated.full_name},
                "roles": list(profile.roles.values_list("name", flat=True)),
                "permissions": profile.permission_codes(),
                "is_super_admin": profile.is_super_admin or authenticated.is_superuser,
            }
        )
        set_auth_cookies(response, access, refresh, staff=True)
        return response


class StaffRefreshView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        raw_refresh = request.COOKIES.get(settings.STAFF_REFRESH_COOKIE)
        if not raw_refresh:
            raise ApplicationError("No refresh token present.", code="missing_refresh_token", status_code=401)
        try:
            refresh = RefreshToken(raw_refresh)
        except InvalidToken:
            raise ApplicationError("Session expired, please log in again.", code="invalid_refresh_token", status_code=401)

        old_jti = refresh["jti"]
        session = StaffSession.objects.filter(refresh_jti=old_jti).first()
        if session and session.revoked_at:
            raise ApplicationError("This session has been revoked.", code="session_revoked", status_code=401)

        user = User.objects.get(pk=refresh["user_id"])
        if not user.is_staff or not user.is_active:
            raise ApplicationError("Staff access revoked.", code="account_disabled", status_code=403)

        access, new_refresh = issue_tokens(user, "staff")
        new_jti = RefreshToken(new_refresh)["jti"]
        if session:
            session.refresh_jti = new_jti
            session.save(update_fields=["refresh_jti"])
        try:
            refresh.blacklist()
        except Exception:
            pass

        response = Response({"status": "refreshed"})
        set_auth_cookies(response, access, new_refresh, staff=True)
        return response


class StaffLogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        raw_refresh = request.COOKIES.get(settings.STAFF_REFRESH_COOKIE)
        if raw_refresh:
            try:
                token = RefreshToken(raw_refresh)
                StaffSession.objects.filter(refresh_jti=token["jti"]).update(revoked_at=timezone.now())
                token.blacklist()
            except Exception:
                pass
        response = Response({"status": "logged_out"})
        clear_auth_cookies(response, staff=True)
        return response


class StaffMeView(APIView):
    permission_classes = [IsOperationsStaff]

    def get(self, request):
        profile, _ = StaffProfile.objects.get_or_create(user=request.user)
        return Response(
            {
                "user": {"id": str(request.user.id), "email": request.user.email, "full_name": request.user.full_name},
                "roles": list(profile.roles.values_list("name", flat=True)),
                "permissions": profile.permission_codes(),
                "is_super_admin": profile.is_super_admin or request.user.is_superuser,
            }
        )


class StaffSessionListView(APIView):
    permission_classes = [IsOperationsStaff]

    def get(self, request):
        profile = StaffProfile.objects.get(user=request.user)
        sessions = StaffSession.objects.filter(staff=profile).order_by("-last_seen_at")
        return Response(
            [
                {
                    "id": str(s.id), "ip_address": s.ip_address, "user_agent": s.user_agent,
                    "last_seen_at": s.last_seen_at, "is_active": s.is_active,
                }
                for s in sessions
            ]
        )

    def delete(self, request):
        """Force-logout every other session for the signed-in staff member."""
        profile = StaffProfile.objects.get(user=request.user)
        StaffSession.objects.filter(staff=profile, revoked_at__isnull=True).update(revoked_at=timezone.now())
        return Response({"status": "all_sessions_revoked"})
