from rest_framework.routers import DefaultRouter

from .views import BundleViewSet, CategoryViewSet, ProductViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("products", ProductViewSet, basename="product")
router.register("combos", BundleViewSet, basename="bundle")

urlpatterns = router.urls
