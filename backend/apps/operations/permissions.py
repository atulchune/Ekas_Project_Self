"""Canonical permission-code catalog and the DRF permission classes that
enforce it. Every operations endpoint declares a required code; the
frontend also receives this same code list at login so it can hide
controls the signed-in staff member cannot use -- but the backend check
here is the one that actually matters."""
from rest_framework.permissions import BasePermission

PERMISSION_CATALOG = {
    "dashboard": ["dashboard.view"],
    "products": ["products.view", "products.manage"],
    "categories": ["categories.view", "categories.manage"],
    "inventory": ["inventory.view", "inventory.manage"],
    "orders": ["orders.view", "orders.manage"],
    "customers": ["customers.view", "customers.manage"],
    "payments": ["payments.view", "payments.manage"],
    "shipments": ["shipments.view", "shipments.manage"],
    "returns": ["returns.view", "returns.manage"],
    "coupons": ["coupons.view", "coupons.manage"],
    "combos": ["combos.view", "combos.manage"],
    "reviews": ["reviews.view", "reviews.manage"],
    "homepage": ["homepage.view", "homepage.manage"],
    "media": ["media.view", "media.manage"],
    "recipes": ["recipes.view", "recipes.manage"],
    "blogs": ["blogs.view", "blogs.manage"],
    "notifications": ["notifications.view", "notifications.manage"],
    "newsletter": ["newsletter.view", "newsletter.manage"],
    "enquiries": ["enquiries.view", "enquiries.manage"],
    "reports": ["reports.view"],
    "staff": ["staff.view", "staff.manage"],
    "roles": ["roles.view", "roles.manage"],
    "audit": ["audit.view"],
    "settings": ["settings.view", "settings.manage"],
}


def all_permission_codes():
    return [code for codes in PERMISSION_CATALOG.values() for code in codes]


class IsOperationsStaff(BasePermission):
    message = "Operations Portal access requires a staff account."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class HasOperationsPermission(BasePermission):
    """Attach via `permission_code = "products.manage"` on the view, or
    override `get_required_permission_code` for per-action codes."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated and request.user.is_staff):
            return False
        profile = getattr(request.user, "staff_profile", None)
        if not profile:
            return False
        request.staff_profile = profile
        code = view.get_required_permission_code() if hasattr(view, "get_required_permission_code") else getattr(
            view, "permission_code", None
        )
        if code is None:
            return True
        return profile.has_permission(code)


def require_permission(code):
    def decorator(view_class):
        view_class.permission_code = code
        return view_class

    return decorator
