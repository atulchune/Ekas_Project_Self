from rest_framework import serializers

from apps.catalog.serializers import ProductListSerializer, ProductVariantSerializer

from .models import Cart, CartItem, RecentlyViewed, StockNotification, Wishlist


class CartItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantSerializer(read_only=True)
    product_name = serializers.CharField(source="variant.product.name", read_only=True)
    product_slug = serializers.CharField(source="variant.product.slug", read_only=True)
    bundle_name = serializers.CharField(source="bundle.name", read_only=True, default=None)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id", "variant", "bundle", "bundle_name", "product_name", "product_slug",
            "quantity", "line_total", "created_at",
        ]

    def get_line_total(self, obj):
        return obj.variant.price * obj.quantity


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    item_count = serializers.SerializerMethodField()
    pricing = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "coupon_code", "items", "item_count", "pricing"]

    def get_item_count(self, obj):
        return sum(i.quantity for i in obj.items.all())

    def get_pricing(self, obj):
        from .services import cart_summary

        return cart_summary(obj)


class AddCartItemSerializer(serializers.Serializer):
    variant_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1, default=1)
    bundle_id = serializers.UUIDField(required=False, allow_null=True)


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=0)


class ApplyCouponSerializer(serializers.Serializer):
    code = serializers.CharField(allow_blank=True)


class WishlistSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "product", "created_at"]


class RecentlyViewedSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = RecentlyViewed
        fields = ["id", "product", "viewed_at"]


class StockNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockNotification
        fields = ["id", "email", "variant"]
