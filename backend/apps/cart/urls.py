from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ApplyCouponView,
    CartItemView,
    CartView,
    RecentlyViewedView,
    StockNotificationView,
    WishlistViewSet,
)

router = DefaultRouter()
router.register("wishlist", WishlistViewSet, basename="wishlist")

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/items/<uuid:item_id>/", CartItemView.as_view(), name="cart-item"),
    path("cart/apply-coupon/", ApplyCouponView.as_view(), name="cart-apply-coupon"),
    path("recently-viewed/", RecentlyViewedView.as_view(), name="recently-viewed"),
    path("stock-notifications/", StockNotificationView.as_view(), name="stock-notifications"),
] + router.urls
