"""Cookie helpers shared by customer auth (apps.accounts) and staff auth
(apps.operations). Access/refresh tokens are never exposed to JavaScript:
they only ever travel as HttpOnly cookies."""
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken


def issue_tokens(user, audience):
    refresh = RefreshToken.for_user(user)
    refresh["aud"] = audience
    access = refresh.access_token
    access["aud"] = audience
    return str(access), str(refresh)


def _cookie_kwargs(max_age):
    return dict(
        max_age=max_age,
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        domain=settings.AUTH_COOKIE_DOMAIN,
        path="/",
    )


def set_auth_cookies(response, access, refresh, staff=False):
    access_name = settings.STAFF_ACCESS_COOKIE if staff else settings.CUSTOMER_ACCESS_COOKIE
    refresh_name = settings.STAFF_REFRESH_COOKIE if staff else settings.CUSTOMER_REFRESH_COOKIE
    access_seconds = int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds())
    refresh_seconds = int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())
    response.set_cookie(access_name, access, **_cookie_kwargs(access_seconds))
    response.set_cookie(refresh_name, refresh, **_cookie_kwargs(refresh_seconds))


def clear_auth_cookies(response, staff=False):
    access_name = settings.STAFF_ACCESS_COOKIE if staff else settings.CUSTOMER_ACCESS_COOKIE
    refresh_name = settings.STAFF_REFRESH_COOKIE if staff else settings.CUSTOMER_REFRESH_COOKIE
    response.delete_cookie(access_name, path="/")
    response.delete_cookie(refresh_name, path="/")
