from rest_framework import serializers

from apps.promotions.models import Coupon, CouponUsage, Promotion

from .base import OperationsModelViewSet


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = "__all__"
        read_only_fields = ["times_used"]


class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = "__all__"


class CouponUsageSerializer(serializers.ModelSerializer):
    coupon_code = serializers.CharField(source="coupon.code", read_only=True)
    customer_email = serializers.CharField(source="user.email", read_only=True)
    order_number = serializers.CharField(source="order.order_number", read_only=True)

    class Meta:
        model = CouponUsage
        fields = "__all__"


class CouponOpsViewSet(OperationsModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    resource_type = "coupon"
    view_permission_code = "coupons.view"
    manage_permission_code = "coupons.manage"
    search_fields = ["code", "name"]
    filterset_fields = ["is_active", "scope"]


class PromotionOpsViewSet(OperationsModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    resource_type = "promotion"
    view_permission_code = "coupons.view"
    manage_permission_code = "coupons.manage"
    filterset_fields = ["is_active", "scope"]


class CouponUsageOpsViewSet(OperationsModelViewSet):
    queryset = CouponUsage.objects.select_related("coupon", "user", "order").all()
    serializer_class = CouponUsageSerializer
    resource_type = "coupon_usage"
    view_permission_code = "coupons.view"
    manage_permission_code = "coupons.view"
    http_method_names = ["get", "head", "options"]
    filterset_fields = ["coupon"]
