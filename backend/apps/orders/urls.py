from rest_framework.routers import DefaultRouter

from .views import CancelOrderView, CheckoutView, OrderViewSet
from django.urls import path

router = DefaultRouter()
router.register("orders", OrderViewSet, basename="order")

urlpatterns = [
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("orders/<str:order_number>/cancel/", CancelOrderView.as_view(), name="order-cancel"),
] + router.urls
