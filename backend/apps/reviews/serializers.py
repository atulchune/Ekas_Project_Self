from rest_framework import serializers

from apps.orders.models import OrderItem

from .models import Review, ReviewMedia


class ReviewMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewMedia
        fields = ["id", "image", "video"]


class ReviewSerializer(serializers.ModelSerializer):
    media = ReviewMediaSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id", "product", "customer_name", "rating", "title", "body", "is_verified_purchase",
            "status", "staff_reply", "staff_reply_at", "media", "created_at",
        ]
        read_only_fields = ["is_verified_purchase", "status", "staff_reply", "staff_reply_at"]

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user
        product = validated_data["product"]
        order_item = OrderItem.objects.filter(
            order__user=user, order__status__in=["confirmed", "packed", "shipped", "out_for_delivery", "delivered"],
            variant__product=product,
        ).first()
        return Review.objects.create(
            user=user, is_verified_purchase=bool(order_item), order_item=order_item, **validated_data
        )
