from django.utils import timezone
from rest_framework import serializers

from apps.reviews.models import Review, ReviewMedia

from .audit import log_action
from .base import OperationsModelViewSet


class ReviewMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewMedia
        fields = "__all__"


class ReviewOpsSerializer(serializers.ModelSerializer):
    media = ReviewMediaSerializer(many=True, read_only=True)
    customer_email = serializers.CharField(source="user.email", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Review
        fields = "__all__"


class ReviewOpsViewSet(OperationsModelViewSet):
    queryset = Review.objects.select_related("user", "product").prefetch_related("media").all()
    serializer_class = ReviewOpsSerializer
    resource_type = "review"
    view_permission_code = "reviews.view"
    manage_permission_code = "reviews.manage"
    http_method_names = ["get", "patch", "delete", "head", "options"]
    filterset_fields = ["status", "product", "rating"]
    search_fields = ["title", "body", "user__email"]

    def perform_update(self, serializer):
        before = serializer.instance.status
        if "staff_reply" in self.request.data and self.request.data["staff_reply"]:
            serializer.validated_data["staff_reply_at"] = timezone.now()
        instance = serializer.save()
        log_action(
            staff=self.request.user, action="moderate", resource_type="review", resource_id=instance.pk,
            previous_value={"status": before}, new_value={"status": instance.status}, request=self.request,
        )
