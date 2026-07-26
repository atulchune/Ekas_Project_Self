import secrets

from django.contrib.auth import authenticate
from django.middleware.csrf import get_token
from django.utils import timezone
from datetime import timedelta

from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken

from django.conf import settings

from apps.cart.services import merge_guest_cart_into_user, GUEST_CART_COOKIE
from apps.core.exceptions import ApplicationError

from .models import Address, CustomerProfile, EmailVerificationToken, LoginHistory, PasswordResetToken, User
from .serializers import (
    AddressSerializer,
    ChangePasswordSerializer,
    CustomerProfileSerializer,
    LoginSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    UserSerializer,
)
from .tasks import queue_password_reset_email, queue_verification_email, queue_welcome_email
from .tokens import clear_auth_cookies, issue_tokens, set_auth_cookies


def _client_ip(request):
    return request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", ""))[:45]


class CsrfView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"csrfToken": get_token(request)})


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = User.objects.create_user(
            email=data["email"], password=data["password"], first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""), phone=data.get("phone", ""),
        )
        CustomerProfile.objects.create(user=user)

        token = secrets.token_urlsafe(32)
        EmailVerificationToken.objects.create(user=user, token=token, expires_at=timezone.now() + timedelta(hours=24))
        queue_verification_email(user, token)
        queue_welcome_email(user)

        access, refresh = issue_tokens(user, "customer")
        guest_token = request.COOKIES.get(GUEST_CART_COOKIE)
        if guest_token:
            merge_guest_cart_into_user(user, guest_token)

        response = Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        set_auth_cookies(response, access, refresh, staff=False)
        return response


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].lower()
        password = serializer.validated_data["password"]

        user = User.objects.filter(email=email).first()
        if user and user.locked_until and user.locked_until > timezone.now():
            raise ApplicationError(
                "Too many failed attempts. Try again later.", code="account_locked", status_code=423
            )

        authenticated = authenticate(request, username=email, password=password) if user else None
        if not authenticated:
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

        authenticated.failed_login_attempts = 0
        authenticated.locked_until = None
        authenticated.save(update_fields=["failed_login_attempts", "locked_until"])
        LoginHistory.objects.create(
            user=authenticated, ip_address=_client_ip(request),
            user_agent=request.META.get("HTTP_USER_AGENT", "")[:255], success=True,
        )

        guest_token = request.COOKIES.get(GUEST_CART_COOKIE)
        if guest_token:
            merge_guest_cart_into_user(authenticated, guest_token)

        access, refresh = issue_tokens(authenticated, "customer")
        response = Response(UserSerializer(authenticated).data)
        set_auth_cookies(response, access, refresh, staff=False)
        return response


class RefreshView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        raw_refresh = request.COOKIES.get(settings.CUSTOMER_REFRESH_COOKIE)
        if not raw_refresh:
            raise ApplicationError("No refresh token present.", code="missing_refresh_token", status_code=401)
        try:
            refresh = RefreshToken(raw_refresh)
        except InvalidToken:
            raise ApplicationError("Session expired, please log in again.", code="invalid_refresh_token", status_code=401)

        user = User.objects.get(pk=refresh["user_id"])
        access, new_refresh = issue_tokens(user, "customer")
        try:
            refresh.blacklist()
        except Exception:
            pass
        response = Response({"status": "refreshed"})
        set_auth_cookies(response, access, new_refresh, staff=False)
        return response


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        raw_refresh = request.COOKIES.get(settings.CUSTOMER_REFRESH_COOKIE)
        if raw_refresh:
            try:
                RefreshToken(raw_refresh).blacklist()
            except Exception:
                pass
        response = Response({"status": "logged_out"})
        clear_auth_cookies(response, staff=False)
        return response


class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get("token")
        record = EmailVerificationToken.objects.filter(token=token, used_at__isnull=True).first()
        if not record or record.expires_at < timezone.now():
            raise ApplicationError("This verification link is invalid or expired.", code="invalid_token", status_code=400)
        record.used_at = timezone.now()
        record.save(update_fields=["used_at"])
        record.user.email_verified = True
        record.user.save(update_fields=["email_verified"])
        return Response({"status": "verified"})


class ResendVerificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = "auth"

    def post(self, request):
        if request.user.email_verified:
            return Response({"status": "already_verified"})
        token = secrets.token_urlsafe(32)
        EmailVerificationToken.objects.create(
            user=request.user, token=token, expires_at=timezone.now() + timedelta(hours=24)
        )
        queue_verification_email(request.user, token)
        return Response({"status": "sent"})


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(email=serializer.validated_data["email"].lower()).first()
        if user:
            token = secrets.token_urlsafe(32)
            PasswordResetToken.objects.create(user=user, token=token, expires_at=timezone.now() + timedelta(hours=2))
            queue_password_reset_email(user, token)
        # Always 200 regardless of whether the account exists, to avoid leaking registered emails.
        return Response({"status": "if_account_exists_email_sent"})


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        record = PasswordResetToken.objects.filter(
            token=serializer.validated_data["token"], used_at__isnull=True
        ).first()
        if not record or record.expires_at < timezone.now():
            raise ApplicationError("This reset link is invalid or expired.", code="invalid_token", status_code=400)
        record.used_at = timezone.now()
        record.save(update_fields=["used_at"])
        record.user.set_password(serializer.validated_data["password"])
        record.user.save(update_fields=["password"])
        return Response({"status": "password_reset"})


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if not request.user.check_password(serializer.validated_data["current_password"]):
            raise ApplicationError("Current password is incorrect.", code="invalid_current_password", status_code=400)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save(update_fields=["password"])
        return Response({"status": "password_changed"})


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = CustomerProfile.objects.get_or_create(user=request.user)
        return Response(CustomerProfileSerializer(profile).data)

    def patch(self, request):
        user_serializer = UserSerializer(request.user, data=request.data, partial=True)
        user_serializer.is_valid(raise_exception=True)
        user_serializer.save()
        profile, _ = CustomerProfile.objects.get_or_create(user=request.user)
        for field in ("accepts_marketing", "notify_order_updates", "notify_promotions"):
            if field in request.data:
                setattr(profile, field, request.data[field])
        profile.save()
        return Response(CustomerProfileSerializer(profile).data)


class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
