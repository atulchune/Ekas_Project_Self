from rest_framework import serializers

from .models import BlogPost, HomepageSection, Recipe, RecipeIngredient, SiteAnnouncement, StaticPage


class SiteAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteAnnouncement
        fields = ["id", "message", "link_label", "link_url", "display_order"]


class HomepageSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomepageSection
        fields = [
            "id", "section_type", "title", "subtitle", "body", "image", "video_url",
            "cta_label", "cta_url", "content", "device_visibility", "display_order",
        ]


class RecipeIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeIngredient
        fields = ["id", "name", "quantity", "display_order"]


class RecipeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = [
            "id", "title", "slug", "description", "image", "prep_time_minutes",
            "cook_time_minutes", "servings", "difficulty", "dietary_tags",
        ]


class RecipeDetailSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(many=True, read_only=True)
    ekas_products = serializers.SlugRelatedField(slug_field="slug", many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = [
            "id", "title", "slug", "description", "image", "video_url", "prep_time_minutes",
            "cook_time_minutes", "servings", "difficulty", "instructions", "dietary_tags",
            "ekas_products", "nutrition_info", "ingredients", "seo_title", "seo_description",
        ]


class BlogListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ["id", "title", "slug", "excerpt", "cover_image", "category", "tags", "created_at"]


class BlogDetailSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.full_name", read_only=True, default="")

    class Meta:
        model = BlogPost
        fields = [
            "id", "title", "slug", "excerpt", "body", "cover_image", "author_name",
            "category", "tags", "seo_title", "seo_description", "created_at",
        ]


class StaticPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticPage
        fields = ["slug", "title", "body"]
