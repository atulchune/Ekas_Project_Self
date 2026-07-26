from rest_framework import serializers

from apps.accounts.models import Address

from .models import CancellationRequest, Order, OrderItem, OrderStatusHistory


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "product_name", "variant_label", "sku", "quantity", "unit_price", "line_total"]


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusHistory
        fields = ["id", "from_status", "to_status", "note", "created_at"]


class OrderListSerializer(serializers.ModelSerializer):
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ["id", "order_number", "status", "payment_method", "total", "placed_at", "item_count"]

    def get_item_count(self, obj):
        return sum(i.quantity for i in obj.items.all())


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)
    tracking = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id", "order_number", "status", "payment_method", "subtotal", "discount_total",
            "shipping_fee", "tax_total", "total", "coupon_code", "placed_at", "confirmed_at",
            "cancelled_at", "cancellation_reason",
            "shipping_full_name", "shipping_phone", "shipping_line1", "shipping_line2",
            "shipping_city", "shipping_state", "shipping_pincode",
            "billing_same_as_shipping", "billing_full_name", "billing_line1", "billing_city",
            "billing_state", "billing_pincode",
            "items", "status_history", "tracking",
        ]

    def get_tracking(self, obj):
        shipment = getattr(obj, "shipment", None)
        if not shipment:
            return None
        return {
            "courier_name": shipment.courier_name,
            "tracking_number": shipment.tracking_number,
            "tracking_url": shipment.tracking_url,
            "status": shipment.status,
            "shipped_at": shipment.shipped_at,
            "delivered_at": shipment.delivered_at,
        }


class CheckoutSerializer(serializers.Serializer):
    address_id = serializers.UUIDField()
    billing_address_id = serializers.UUIDField(required=False, allow_null=True)
    payment_method = serializers.ChoiceField(choices=Order.PAYMENT_METHOD_CHOICES)
    coupon_code = serializers.CharField(required=False, allow_blank=True)
    idempotency_key = serializers.CharField(max_length=100)

    def validate(self, attrs):
        request = self.context["request"]
        try:
            attrs["address"] = Address.objects.get(pk=attrs["address_id"], user=request.user)
        except Address.DoesNotExist:
            raise serializers.ValidationError({"address_id": "Address not found."})
        attrs["billing_address"] = None
        if attrs.get("billing_address_id"):
            try:
                attrs["billing_address"] = Address.objects.get(pk=attrs["billing_address_id"], user=request.user)
            except Address.DoesNotExist:
                raise serializers.ValidationError({"billing_address_id": "Billing address not found."})
        return attrs


class CancellationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CancellationRequest
        fields = ["id", "order", "reason", "status", "created_at"]
        read_only_fields = ["id", "status", "created_at"]
