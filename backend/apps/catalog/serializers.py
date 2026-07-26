from rest_framework import serializers

from .models import Bundle, BundleItem, Category, Product, ProductImage, ProductVariant, ProductVideo


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Category
        fields = [
            "id", "name", "slug", "description", "parent", "image", "is_active",
            "display_order", "seo_title", "seo_description", "product_count",
        ]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "variant", "image", "alt_text", "display_order", "is_primary"]


class ProductVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVideo
        fields = ["id", "video", "video_url", "thumbnail", "title", "display_order"]


class ProductVariantSerializer(serializers.ModelSerializer):
    savings_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    savings_percent = serializers.IntegerField(read_only=True)
    available_quantity = serializers.SerializerMethodField()
    stock_status = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariant
        fields = [
            "id", "sku", "label", "weight_grams", "dimensions", "price", "mrp",
            "is_default", "is_active", "display_order", "savings_amount",
            "savings_percent", "available_quantity", "stock_status",
        ]

    def get_available_quantity(self, obj):
        inv = getattr(obj, "inventory", None)
        return inv.available_quantity if inv else 0

    def get_stock_status(self, obj):
        inv = getattr(obj, "inventory", None)
        if not inv:
            return "out_of_stock"
        if inv.available_quantity <= 0:
            return "out_of_stock"
        if inv.available_quantity <= inv.low_stock_threshold:
            return "low_stock"
        return "in_stock"


class ProductListSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="slug", read_only=True)
    primary_image = serializers.SerializerMethodField()
    price_range = serializers.SerializerMethodField()
    default_variant = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "short_description", "category", "is_featured",
            "is_bestseller", "is_new_launch", "average_rating", "review_count",
            "primary_image", "price_range", "default_variant", "status",
        ]

    def get_primary_image(self, obj):
        request = self.context.get("request")
        img = next((i for i in obj.images.all() if i.is_primary), None) or next(iter(obj.images.all()), None)
        if not img:
            return None
        url = img.image.url
        return request.build_absolute_uri(url) if request else url

    def get_price_range(self, obj):
        variants = [v for v in obj.variants.all() if v.is_active]
        if not variants:
            return None
        return {
            "min_price": min(v.price for v in variants),
            "max_price": max(v.price for v in variants),
            "min_mrp": min(v.mrp for v in variants),
        }

    def get_default_variant(self, obj):
        variants = [v for v in obj.variants.all() if v.is_active]
        if not variants:
            return None
        default = next((v for v in variants if v.is_default), variants[0])
        return ProductVariantSerializer(default).data


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    videos = ProductVideoSerializer(many=True, read_only=True)
    related_products = ProductListSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "short_description", "description", "category",
            "source", "ingredients", "preparation", "aroma_texture", "culinary_uses",
            "storage_instructions", "shelf_life", "allergens", "nutrition_info",
            "certifications", "is_featured", "is_bestseller", "is_new_launch",
            "average_rating", "review_count", "seo_title", "seo_description",
            "variants", "images", "videos", "related_products", "status",
        ]


class BundleItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantSerializer(read_only=True)
    product_name = serializers.CharField(source="variant.product.name", read_only=True)

    class Meta:
        model = BundleItem
        fields = ["id", "variant", "product_name", "quantity"]


class BundleSerializer(serializers.ModelSerializer):
    items = BundleItemSerializer(many=True, read_only=True)
    items_mrp_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Bundle
        fields = [
            "id", "name", "slug", "description", "image", "bundle_price",
            "is_active", "status", "items", "items_mrp_total",
        ]
