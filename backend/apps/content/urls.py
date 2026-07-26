from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import BlogViewSet, HomepageContentView, RecipeViewSet, StaticPageView

router = DefaultRouter()
router.register("recipes", RecipeViewSet, basename="recipe")
router.register("blog", BlogViewSet, basename="blog")

urlpatterns = [
    path("homepage/", HomepageContentView.as_view(), name="homepage-content"),
    path("pages/<slug:slug>/", StaticPageView.as_view(), name="static-page"),
] + router.urls
