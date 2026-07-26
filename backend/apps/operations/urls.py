from django.urls import path
from rest_framework.routers import DefaultRouter

from .audit_views import AuditLogViewSet
from .auth_views import StaffLoginView, StaffLogoutView, StaffMeView, StaffRefreshView, StaffSessionListView
from .catalog_views import (
    BundleItemOpsViewSet,
    BundleOpsViewSet,
    CategoryOpsViewSet,
    ProductImageOpsViewSet,
    ProductOpsViewSet,
    ProductVariantOpsViewSet,
    ProductVideoOpsViewSet,
)
from .content_views import (
    BlogPostOpsViewSet,
    HomepageSectionOpsViewSet,
    MediaAssetOpsViewSet,
    RecipeIngredientOpsViewSet,
    RecipeOpsViewSet,
    SiteAnnouncementOpsViewSet,
    StaticPageOpsViewSet,
)
from .customers_views import CustomerDeactivateView, CustomerLoginHistoryView, CustomerOpsViewSet
from .dashboard_views import DashboardView
from .engagement_views import (
    ContactEnquiryOpsViewSet,
    EnquiryNoteOpsViewSet,
    NewsletterCampaignView,
    NewsletterSubscriberOpsViewSet,
    NotificationLogOpsViewSet,
)
from .inventory_views import AdjustStockView, InventoryMovementListView, InventoryOpsViewSet, RestockView
from .orders_views import (
    CancellationRequestOpsViewSet,
    InternalOrderNoteViewSet,
    OrderCancelOpsView,
    OrderOpsViewSet,
    OrderTransitionView,
    PaymentOpsViewSet,
    RefundOpsViewSet,
    ShipmentOpsViewSet,
)
from .promotions_views import CouponOpsViewSet, CouponUsageOpsViewSet, PromotionOpsViewSet
from .reports_views import ReportExportView, ReportListView
from .reviews_views import ReviewOpsViewSet
from .settings_views import StoreSettingsView, StoreSettingUpdateView
from .staff_views import (
    InviteStaffView,
    PermissionListView,
    RoleOpsViewSet,
    StaffAssignRolesView,
    StaffDeactivateView,
    StaffForceLogoutView,
    StaffOpsViewSet,
)

router = DefaultRouter()
router.register("categories", CategoryOpsViewSet, basename="ops-category")
router.register("products", ProductOpsViewSet, basename="ops-product")
router.register("product-variants", ProductVariantOpsViewSet, basename="ops-product-variant")
router.register("product-images", ProductImageOpsViewSet, basename="ops-product-image")
router.register("product-videos", ProductVideoOpsViewSet, basename="ops-product-video")
router.register("combos", BundleOpsViewSet, basename="ops-bundle")
router.register("combo-items", BundleItemOpsViewSet, basename="ops-bundle-item")

router.register("inventory", InventoryOpsViewSet, basename="ops-inventory")
router.register("inventory-movements", InventoryMovementListView, basename="ops-inventory-movement")

router.register("orders", OrderOpsViewSet, basename="ops-order")
router.register("order-notes", InternalOrderNoteViewSet, basename="ops-order-note")
router.register("shipments", ShipmentOpsViewSet, basename="ops-shipment")
router.register("payments", PaymentOpsViewSet, basename="ops-payment")
router.register("refunds", RefundOpsViewSet, basename="ops-refund")
router.register("cancellation-requests", CancellationRequestOpsViewSet, basename="ops-cancellation-request")

router.register("customers", CustomerOpsViewSet, basename="ops-customer")

router.register("coupons", CouponOpsViewSet, basename="ops-coupon")
router.register("promotions", PromotionOpsViewSet, basename="ops-promotion")
router.register("coupon-usage", CouponUsageOpsViewSet, basename="ops-coupon-usage")

router.register("reviews", ReviewOpsViewSet, basename="ops-review")

router.register("announcements", SiteAnnouncementOpsViewSet, basename="ops-announcement")
router.register("homepage-sections", HomepageSectionOpsViewSet, basename="ops-homepage-section")
router.register("media", MediaAssetOpsViewSet, basename="ops-media")
router.register("recipes", RecipeOpsViewSet, basename="ops-recipe")
router.register("recipe-ingredients", RecipeIngredientOpsViewSet, basename="ops-recipe-ingredient")
router.register("blog-posts", BlogPostOpsViewSet, basename="ops-blog-post")
router.register("static-pages", StaticPageOpsViewSet, basename="ops-static-page")

router.register("notifications", NotificationLogOpsViewSet, basename="ops-notification")
router.register("newsletter-subscribers", NewsletterSubscriberOpsViewSet, basename="ops-newsletter-subscriber")
router.register("enquiries", ContactEnquiryOpsViewSet, basename="ops-enquiry")
router.register("enquiry-notes", EnquiryNoteOpsViewSet, basename="ops-enquiry-note")

router.register("roles", RoleOpsViewSet, basename="ops-role")
router.register("staff", StaffOpsViewSet, basename="ops-staff")
router.register("audit-logs", AuditLogViewSet, basename="ops-audit-log")

urlpatterns = [
    path("auth/login/", StaffLoginView.as_view(), name="ops-login"),
    path("auth/logout/", StaffLogoutView.as_view(), name="ops-logout"),
    path("auth/refresh/", StaffRefreshView.as_view(), name="ops-refresh"),
    path("auth/me/", StaffMeView.as_view(), name="ops-me"),
    path("auth/sessions/", StaffSessionListView.as_view(), name="ops-sessions"),

    path("dashboard/", DashboardView.as_view(), name="ops-dashboard"),

    path("inventory/<uuid:variant_id>/restock/", RestockView.as_view(), name="ops-inventory-restock"),
    path("inventory/<uuid:variant_id>/adjust/", AdjustStockView.as_view(), name="ops-inventory-adjust"),

    path("orders/<str:order_number>/transition/", OrderTransitionView.as_view(), name="ops-order-transition"),
    path("orders/<str:order_number>/cancel/", OrderCancelOpsView.as_view(), name="ops-order-cancel"),

    path("customers/<uuid:pk>/deactivate/", CustomerDeactivateView.as_view(), name="ops-customer-deactivate"),
    path("customers/<uuid:pk>/login-history/", CustomerLoginHistoryView.as_view(), name="ops-customer-login-history"),

    path("newsletter/send-campaign/", NewsletterCampaignView.as_view(), name="ops-newsletter-campaign"),

    path("permissions/", PermissionListView.as_view(), name="ops-permissions"),
    path("staff/invite/", InviteStaffView.as_view(), name="ops-staff-invite"),
    path("staff/<uuid:pk>/deactivate/", StaffDeactivateView.as_view(), name="ops-staff-deactivate"),
    path("staff/<uuid:pk>/assign-roles/", StaffAssignRolesView.as_view(), name="ops-staff-assign-roles"),
    path("staff/<uuid:pk>/force-logout/", StaffForceLogoutView.as_view(), name="ops-staff-force-logout"),

    path("reports/", ReportListView.as_view(), name="ops-reports"),
    path("reports/<str:report_type>/export/", ReportExportView.as_view(), name="ops-report-export"),

    path("settings/", StoreSettingsView.as_view(), name="ops-settings"),
    path("settings/<str:key>/", StoreSettingUpdateView.as_view(), name="ops-settings-update"),
] + router.urls
