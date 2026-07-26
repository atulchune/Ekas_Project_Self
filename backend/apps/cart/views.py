from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalog.models import Product, ProductVariant

from . import services
from .models import RecentlyViewed, StockNotification, Wishlist
from .serializers import (
    AddCartItemSerializer,
    ApplyCouponSerializer,
    CartSerializer,
    RecentlyViewedSerializer,
    StockNotificationSerializer,
    UpdateCartItemSerializer,
    WishlistSerializer,
)


class CartView(APIView):
    permission_classes = [permissions.AllowAny]

    def _respond(self, cart, guest_token, status_code=200):
        response = Response(CartSerializer(cart).data, status=status_code)
        if guest_token:
            response.set_cookie(
                services.GUEST_CART_COOKIE, guest_token, max_age=60 * 60 * 24 * 30, httponly=True, samesite="Lax"
            )
        return response

    def get(self, request):
        cart, guest_token = services.get_or_create_cart(request)
        return self._respond(cart, guest_token)

    def post(self, request):
        serializer = AddCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        cart, guest_token = services.get_or_create_cart(request)
        variant = get_object_or_404(ProductVariant, pk=data["variant_id"])
        bundle = None
        if data.get("bundle_id"):
            from apps.catalog.models import Bundle

            bundle = get_object_or_404(Bundle, pk=data["bundle_id"])
        services.add_item(cart, variant, data["quantity"], bundle=bundle)
        cart.refresh_from_db()
        return self._respond(cart, guest_token, status_code=status.HTTP_201_CREATED)

    def delete(self, request):
        cart, guest_token = services.get_or_create_cart(request)
        cart.items.all().delete()
        return self._respond(cart, guest_token)


class CartItemView(APIView):
    permission_classes = [permissions.AllowAny]

    def patch(self, request, item_id):
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart, guest_token = services.get_or_create_cart(request)
        services.update_item_quantity(cart, item_id, serializer.validated_data["quantity"])
        cart.refresh_from_db()
        response = Response(CartSerializer(cart).data)
        return response

    def delete(self, request, item_id):
        cart, guest_token = services.get_or_create_cart(request)
        services.remove_item(cart, item_id)
        cart.refresh_from_db()
        return Response(CartSerializer(cart).data)


class ApplyCouponView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ApplyCouponSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart, guest_token = services.get_or_create_cart(request)
        cart.coupon_code = serializer.validated_data["code"]
        cart.save(update_fields=["coupon_code"])
        summary_serializer = CartSerializer(cart)
        data = summary_serializer.data
        # Surface coupon validation errors immediately rather than silently.
        from apps.promotions.services import price_cart

        lines = [
            {
                "product_id": i.variant.product_id,
                "category_id": i.variant.product.category_id,
                "line_total": i.variant.price * i.quantity,
            }
            for i in cart.items.select_related("variant", "variant__product")
        ]
        if cart.coupon_code and lines:
            price_cart(lines, user=cart.user, coupon_code=cart.coupon_code)
        return Response(data)


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "delete"]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).select_related("product")

    def create(self, request, *args, **kwargs):
        product = get_object_or_404(Product, pk=request.data.get("product_id"))
        obj, _ = Wishlist.objects.get_or_create(user=request.user, product=product)
        return Response(WishlistSerializer(obj).data, status=status.HTTP_201_CREATED)


class RecentlyViewedView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            qs = RecentlyViewed.objects.filter(user=request.user)
        else:
            token = request.COOKIES.get(services.GUEST_CART_COOKIE)
            qs = RecentlyViewed.objects.filter(guest_token=token) if token else RecentlyViewed.objects.none()
        return Response(RecentlyViewedSerializer(qs.select_related("product")[:12], many=True).data)

    def post(self, request):
        product = get_object_or_404(Product, pk=request.data.get("product_id"))
        if request.user.is_authenticated:
            obj, _ = RecentlyViewed.objects.update_or_create(user=request.user, product=product)
        else:
            token = request.COOKIES.get(services.GUEST_CART_COOKIE) or __import__("uuid").uuid4().hex
            obj, _ = RecentlyViewed.objects.update_or_create(guest_token=token, product=product)
            response = Response(status=status.HTTP_201_CREATED)
            response.set_cookie(services.GUEST_CART_COOKIE, token, max_age=60 * 60 * 24 * 30, httponly=True, samesite="Lax")
            return response
        return Response(status=status.HTTP_201_CREATED)


class StockNotificationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = StockNotificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
