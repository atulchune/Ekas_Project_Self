from rest_framework import serializers

from apps.content.models import (
    BlogPost,
    HomepageSection,
    MediaAsset,
    Recipe,
    RecipeIngredient,
    SiteAnnouncement,
    StaticPage,
)

from .base import OperationsModelViewSet


class SiteAnnouncementOpsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteAnnouncement
        fields = "__all__"


class HomepageSectionOpsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomepageSection
        fields = "__all__"
        read_only_fields = ["created_by", "updated_by", "published_at"]


class MediaAssetOpsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAsset
        fields = "__all__"
        read_only_fields = ["created_by", "updated_by", "size_bytes", "width", "height"]

    def create(self, validated_data):
        instance = super().create(validated_data)
        f = instance.file
        if hasattr(f, "size"):
            instance.size_bytes = f.size
            instance.save(update_fields=["size_bytes"])
        return instance


class RecipeIngredientOpsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeIngredient
        fields = "__all__"


class RecipeOpsSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientOpsSerializer(many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = "__all__"
        read_only_fields = ["created_by", "updated_by", "published_at"]


class BlogPostOpsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = "__all__"
        read_only_fields = ["created_by", "updated_by", "published_at"]


class StaticPageOpsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticPage
        fields = "__all__"


class SiteAnnouncementOpsViewSet(OperationsModelViewSet):
    queryset = SiteAnnouncement.objects.all()
    serializer_class = SiteAnnouncementOpsSerializer
    resource_type = "site_announcement"
    view_permission_code = "homepage.view"
    manage_permission_code = "homepage.manage"


class HomepageSectionOpsViewSet(OperationsModelViewSet):
    queryset = HomepageSection.objects.all()
    serializer_class = HomepageSectionOpsSerializer
    resource_type = "homepage_section"
    view_permission_code = "homepage.view"
    manage_permission_code = "homepage.manage"
    filterset_fields = ["section_type", "status", "is_visible"]


class MediaAssetOpsViewSet(OperationsModelViewSet):
    queryset = MediaAsset.objects.all()
    serializer_class = MediaAssetOpsSerializer
    resource_type = "media_asset"
    view_permission_code = "media.view"
    manage_permission_code = "media.manage"
    search_fields = ["alt_text"]
    filterset_fields = ["asset_type"]

    def perform_destroy(self, instance):
        from apps.catalog.models import ProductImage
        from apps.core.exceptions import ApplicationError

        if ProductImage.objects.filter(image=instance.file.name).exists():
            raise ApplicationError(
                "This media asset is used by a product and cannot be deleted.", code="media_in_use", status_code=409
            )
        super().perform_destroy(instance)


class RecipeOpsViewSet(OperationsModelViewSet):
    queryset = Recipe.objects.prefetch_related("ingredients", "ekas_products").all()
    serializer_class = RecipeOpsSerializer
    resource_type = "recipe"
    view_permission_code = "recipes.view"
    manage_permission_code = "recipes.manage"
    filterset_fields = ["status", "difficulty"]
    search_fields = ["title", "slug"]


class RecipeIngredientOpsViewSet(OperationsModelViewSet):
    queryset = RecipeIngredient.objects.all()
    serializer_class = RecipeIngredientOpsSerializer
    resource_type = "recipe_ingredient"
    view_permission_code = "recipes.view"
    manage_permission_code = "recipes.manage"
    filterset_fields = ["recipe"]


class BlogPostOpsViewSet(OperationsModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostOpsSerializer
    resource_type = "blog_post"
    view_permission_code = "blogs.view"
    manage_permission_code = "blogs.manage"
    filterset_fields = ["status", "category"]
    search_fields = ["title", "slug"]


class StaticPageOpsViewSet(OperationsModelViewSet):
    queryset = StaticPage.objects.all()
    serializer_class = StaticPageOpsSerializer
    resource_type = "static_page"
    view_permission_code = "homepage.view"
    manage_permission_code = "homepage.manage"
    lookup_field = "slug"
