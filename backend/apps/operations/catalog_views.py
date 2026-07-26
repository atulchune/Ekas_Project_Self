from rest_framework import serializers

from apps.catalog.models import Bundle, BundleItem, Category, Product, ProductImage, ProductVariant, ProductVideo
from apps.inventory.models import Inventory

from .base import OperationsModelViewSet


class OpsCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class OpsProductVariantSerializer(serializers.ModelSerializer):
    available_quantity = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariant
        fields = "__all__"
        read_only_fields = ["id"]

    def get_available_quantity(self, obj):
        inv = getattr(obj, "inventory", None)
        return inv.available_quantity if inv else 0

    def create(self, validated_data):
        variant = super().create(validated_data)
        Inventory.objects.get_or_create(variant=variant)
        return variant


class OpsProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = "__all__"


class OpsProductVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVideo
        fields = "__all__"


class OpsProductSerializer(serializers.ModelSerializer):
    variants = OpsProductVariantSerializer(many=True, read_only=True)
    images = OpsProductImageSerializer(many=True, read_only=True)
    videos = OpsProductVideoSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = ["id", "average_rating", "review_count", "created_by", "updated_by"]

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["created_by"] = request.user
        validated_data["updated_by"] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data["updated_by"] = self.context["request"].user
        return super().update(instance, validated_data)


class OpsBundleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BundleItem
        fields = "__all__"


class OpsBundleSerializer(serializers.ModelSerializer):
    items = OpsBundleItemSerializer(many=True, read_only=True)

    class Meta:
        model = Bundle
        fields = "__all__"
        read_only_fields = ["id", "created_by", "updated_by"]


class CategoryOpsViewSet(OperationsModelViewSet):
    queryset = Category.objects.all().order_by("display_order", "name")
    serializer_class = OpsCategorySerializer
    resource_type = "category"
    view_permission_code = "categories.view"
    manage_permission_code = "categories.manage"
    filterset_fields = ["is_active", "parent"]
    search_fields = ["name", "slug"]


class ProductOpsViewSet(OperationsModelViewSet):
    queryset = Product.objects.select_related("category").prefetch_related("variants", "images", "videos").all()
    serializer_class = OpsProductSerializer
    resource_type = "product"
    view_permission_code = "products.view"
    manage_permission_code = "products.manage"
    filterset_fields = ["status", "category", "is_featured", "is_bestseller", "is_new_launch"]
    search_fields = ["name", "slug"]


class ProductVariantOpsViewSet(OperationsModelViewSet):
    queryset = ProductVariant.objects.select_related("product", "inventory").all()
    serializer_class = OpsProductVariantSerializer
    resource_type = "product_variant"
    view_permission_code = "products.view"
    manage_permission_code = "products.manage"
    filterset_fields = ["product", "is_active"]


class ProductImageOpsViewSet(OperationsModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = OpsProductImageSerializer
    resource_type = "product_image"
    view_permission_code = "products.view"
    manage_permission_code = "products.manage"
    filterset_fields = ["product", "variant"]


class ProductVideoOpsViewSet(OperationsModelViewSet):
    queryset = ProductVideo.objects.all()
    serializer_class = OpsProductVideoSerializer
    resource_type = "product_video"
    view_permission_code = "products.view"
    manage_permission_code = "products.manage"
    filterset_fields = ["product"]


class BundleOpsViewSet(OperationsModelViewSet):
    queryset = Bundle.objects.prefetch_related("items").all()
    serializer_class = OpsBundleSerializer
    resource_type = "bundle"
    view_permission_code = "combos.view"
    manage_permission_code = "combos.manage"
    filterset_fields = ["status", "is_active"]


class BundleItemOpsViewSet(OperationsModelViewSet):
    queryset = BundleItem.objects.all()
    serializer_class = OpsBundleItemSerializer
    resource_type = "bundle_item"
    view_permission_code = "combos.view"
    manage_permission_code = "combos.manage"
    filterset_fields = ["bundle"]
