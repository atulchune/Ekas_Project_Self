from rest_framework import permissions, viewsets

from .models import Review
from .serializers import ReviewSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    http_method_names = ["get", "post", "delete"]

    def get_permissions(self):
        if self.action in ("create", "destroy"):
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = Review.objects.select_related("user").prefetch_related("media")
        product_slug = self.request.query_params.get("product")
        if product_slug:
            qs = qs.filter(product__slug=product_slug)
        if self.action == "list" and not self.request.query_params.get("mine"):
            qs = qs.filter(status=Review.APPROVED)
        elif self.request.query_params.get("mine") and self.request.user.is_authenticated:
            qs = qs.filter(user=self.request.user)
        return qs

    def perform_destroy(self, instance):
        if instance.user_id != self.request.user.id:
            from apps.core.exceptions import ApplicationError

            raise ApplicationError("You can only delete your own review.", code="forbidden", status_code=403)
        instance.delete()
