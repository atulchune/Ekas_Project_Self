from django.conf import settings
from django.db import models

from apps.core.models import PublishableModel, TrackedModel


class SiteAnnouncement(TrackedModel):
    message = models.CharField(max_length=255)
    link_label = models.CharField(max_length=100, blank=True)
    link_url = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "content_site_announcement"
        ordering = ["display_order"]


class MediaAsset(TrackedModel):
    IMAGE = "image"
    VIDEO = "video"
    ASSET_TYPE_CHOICES = [(IMAGE, "Image"), (VIDEO, "Video")]

    file = models.FileField(upload_to="media-library/%Y/%m/")
    asset_type = models.CharField(max_length=10, choices=ASSET_TYPE_CHOICES, default=IMAGE)
    alt_text = models.CharField(max_length=200, blank=True)
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    size_bytes = models.PositiveIntegerField(null=True, blank=True)
    tags = models.JSONField(default=list, blank=True)

    class Meta:
        db_table = "content_media_asset"
        ordering = ["-created_at"]

    def __str__(self):
        return self.file.name


class HomepageSection(TrackedModel, PublishableModel):
    HERO = "hero"
    TRUST_STRIP = "trust_strip"
    CATEGORY_GRID = "category_grid"
    BESTSELLERS = "bestsellers"
    PRODUCT_FOCUS = "product_focus"
    PROCESS_STORY = "process_story"
    WHY_EKAS = "why_ekas"
    WOMEN_LED = "women_led"
    COMBOS = "combos"
    RECIPES = "recipes"
    TESTIMONIALS = "testimonials"
    IMPACT = "impact"
    NEWSLETTER = "newsletter"
    SECTION_TYPE_CHOICES = [
        (HERO, "Hero"), (TRUST_STRIP, "Trust strip"), (CATEGORY_GRID, "Shop by category"),
        (BESTSELLERS, "Best sellers"), (PRODUCT_FOCUS, "Product in focus"),
        (PROCESS_STORY, "Traditional process story"), (WHY_EKAS, "Why EKAS"),
        (WOMEN_LED, "Women-led story"), (COMBOS, "Combo packs"), (RECIPES, "Recipe inspiration"),
        (TESTIMONIALS, "Testimonials"), (IMPACT, "Social impact"), (NEWSLETTER, "Newsletter"),
    ]
    ALL_DEVICES = "all"
    DESKTOP_ONLY = "desktop"
    MOBILE_ONLY = "mobile"
    DEVICE_CHOICES = [(ALL_DEVICES, "All devices"), (DESKTOP_ONLY, "Desktop only"), (MOBILE_ONLY, "Mobile only")]

    section_type = models.CharField(max_length=20, choices=SECTION_TYPE_CHOICES)
    title = models.CharField(max_length=200, blank=True)
    subtitle = models.CharField(max_length=300, blank=True)
    body = models.TextField(blank=True)
    image = models.ImageField(upload_to="homepage/", blank=True, null=True)
    video_url = models.URLField(blank=True)
    cta_label = models.CharField(max_length=50, blank=True)
    cta_url = models.CharField(max_length=255, blank=True)
    content = models.JSONField(default=dict, blank=True, help_text="Structured per-section payload (e.g. steps, ids)")
    device_visibility = models.CharField(max_length=10, choices=DEVICE_CHOICES, default=ALL_DEVICES)
    is_visible = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "content_homepage_section"
        ordering = ["display_order"]

    def __str__(self):
        return f"{self.section_type} #{self.display_order}"


class Recipe(TrackedModel, PublishableModel):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    DIFFICULTY_CHOICES = [(EASY, "Easy"), (MEDIUM, "Medium"), (HARD, "Hard")]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="recipes/", blank=True, null=True)
    video_url = models.URLField(blank=True)
    prep_time_minutes = models.PositiveIntegerField(default=0)
    cook_time_minutes = models.PositiveIntegerField(default=0)
    servings = models.PositiveIntegerField(default=2)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default=EASY)
    instructions = models.JSONField(default=list, help_text="Ordered list of step strings")
    dietary_tags = models.JSONField(default=list, blank=True)
    ekas_products = models.ManyToManyField("catalog.Product", blank=True, related_name="recipes")
    nutrition_info = models.JSONField(default=dict, blank=True)
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.CharField(max_length=300, blank=True)

    class Meta:
        db_table = "content_recipe"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="ingredients")
    name = models.CharField(max_length=150)
    quantity = models.CharField(max_length=50, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "content_recipe_ingredient"
        ordering = ["display_order"]


class BlogPost(TrackedModel, PublishableModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    excerpt = models.CharField(max_length=300, blank=True)
    body = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to="blog/", blank=True, null=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    category = models.CharField(max_length=100, blank=True)
    tags = models.JSONField(default=list, blank=True)
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.CharField(max_length=300, blank=True)

    class Meta:
        db_table = "content_blog_post"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class StaticPage(TrackedModel):
    """FAQ / Our Story / Our Process / Women Behind EKAS / policies -- all
    editable long-form pages that would otherwise be hardcoded JSX."""

    SLUG_CHOICES = [
        ("our-story", "Our Story"), ("our-process", "Our Process"),
        ("women-behind-ekas", "Women Behind EKAS"), ("faq", "FAQ"),
        ("shipping-policy", "Shipping Policy"), ("return-refund-policy", "Return/Refund Policy"),
        ("privacy-policy", "Privacy Policy"), ("terms-and-conditions", "Terms and Conditions"),
    ]
    slug = models.SlugField(max_length=50, unique=True, choices=SLUG_CHOICES)
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)

    class Meta:
        db_table = "content_static_page"

    def __str__(self):
        return self.slug
