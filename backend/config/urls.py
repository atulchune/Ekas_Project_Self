"""Root URL configuration.

Django Admin is intentionally NOT routed here -- the spec requires every
business workflow to go through the custom Operations Portal APIs under
/api/v1/operations/, never through /admin/.
"""
from django.conf import settings
from django.urls import include, path, re_path
from django.views.static import serve as static_serve
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from apps.core.views import health_view, readiness_view

urlpatterns = [
    path("healthz/", health_view, name="health"),
    path("readyz/", readiness_view, name="readiness"),

    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),

    path("api/v1/", include("apps.accounts.urls")),
    path("api/v1/", include("apps.catalog.urls")),
    path("api/v1/", include("apps.cart.urls")),
    path("api/v1/", include("apps.orders.urls")),
    path("api/v1/", include("apps.payments.urls")),
    path("api/v1/", include("apps.shipping.urls")),
    path("api/v1/", include("apps.reviews.urls")),
    path("api/v1/", include("apps.content.urls")),
    path("api/v1/", include("apps.engagement.urls")),
    path("api/v1/operations/", include("apps.operations.urls")),

    re_path(r"^media/(?P<path>.*)$", static_serve, {"document_root": settings.MEDIA_ROOT}),
]
