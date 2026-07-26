from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken


class _BaseCookieJWTAuthentication(JWTAuthentication):
    cookie_name = None
    require_staff = False

    def authenticate(self, request):
        raw_token = request.COOKIES.get(self.cookie_name)
        if raw_token is None:
            header_token = super().authenticate(request)
            return header_token
        try:
            validated_token = self.get_validated_token(raw_token)
        except InvalidToken:
            return None
        user = self.get_user(validated_token)
        if self.require_staff and not user.is_staff:
            return None
        return user, validated_token


class CookieJWTAuthentication(_BaseCookieJWTAuthentication):
    """Authenticates storefront customers via the ekas_access cookie."""

    cookie_name = settings.CUSTOMER_ACCESS_COOKIE
    require_staff = False


class StaffCookieJWTAuthentication(_BaseCookieJWTAuthentication):
    """Authenticates Operations Portal staff via the ekas_staff_access cookie."""

    cookie_name = settings.STAFF_ACCESS_COOKIE
    require_staff = True
