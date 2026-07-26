from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.inventory import services as inventory_services
from apps.inventory.models import Inventory, InventoryMovement

from .audit import log_action
from .base import OperationsModelViewSet
from .permissions import HasOperationsPermission, IsOperationsStaff


class InventorySerializer(serializers.ModelSerializer):
    sku = serializers.CharField(source="variant.sku", read_only=True)
    product_name = serializers.CharField(source="variant.product.name", read_only=True)
    variant_label = serializers.CharField(source="variant.label", read_only=True)
    available_quantity = serializers.IntegerField(read_only=True)

    class Meta:
        model = Inventory
        fields = [
            "id", "variant", "sku", "product_name", "variant_label", "on_hand_quantity",
            "reserved_quantity", "sold_quantity", "available_quantity", "low_stock_threshold",
        ]
        read_only_fields = ["on_hand_quantity", "reserved_quantity", "sold_quantity"]


class InventoryMovementSerializer(serializers.ModelSerializer):
    sku = serializers.CharField(source="variant.sku", read_only=True)

    class Meta:
        model = InventoryMovement
        fields = "__all__"


class InventoryOpsViewSet(OperationsModelViewSet):
    """Read + low-stock-threshold updates. Stock quantity changes must go
    through the adjust/restock actions so every change is ledgered."""

    queryset = Inventory.objects.select_related("variant", "variant__product").all()
    serializer_class = InventorySerializer
    resource_type = "inventory"
    view_permission_code = "inventory.view"
    manage_permission_code = "inventory.manage"
    http_method_names = ["get", "patch", "head", "options"]
    filterset_fields = ["variant__product"]
    search_fields = ["variant__sku", "variant__product__name"]


class InventoryMovementListView(OperationsModelViewSet):
    queryset = InventoryMovement.objects.select_related("variant", "variant__product", "staff").all()
    serializer_class = InventoryMovementSerializer
    resource_type = "inventory_movement"
    view_permission_code = "inventory.view"
    manage_permission_code = "inventory.view"
    http_method_names = ["get", "head", "options"]
    filterset_fields = ["variant", "movement_type"]


class RestockView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "inventory.manage"

    def post(self, request, variant_id):
        quantity = int(request.data.get("quantity", 0))
        reason = request.data.get("reason", "")
        if quantity <= 0:
            from apps.core.exceptions import ApplicationError

            raise ApplicationError("Quantity must be positive.", code="invalid_quantity", status_code=400)
        inventory = inventory_services.restock(variant_id, quantity, staff=request.user, reason=reason)
        log_action(
            staff=request.user, action="restock", resource_type="inventory", resource_id=variant_id,
            new_value={"quantity": quantity, "reason": reason}, request=request,
        )
        return Response(InventorySerializer(inventory).data)


class AdjustStockView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "inventory.manage"

    def post(self, request, variant_id):
        new_quantity = request.data.get("on_hand_quantity")
        reason = request.data.get("reason", "")
        if new_quantity is None or not reason:
            from apps.core.exceptions import ApplicationError

            raise ApplicationError(
                "A new quantity and reason are both required for a manual adjustment.",
                code="adjustment_reason_required", status_code=400,
            )
        before = Inventory.objects.get(variant_id=variant_id).on_hand_quantity
        inventory = inventory_services.adjust_stock(variant_id, int(new_quantity), staff=request.user, reason=reason)
        log_action(
            staff=request.user, action="stock_adjustment", resource_type="inventory", resource_id=variant_id,
            previous_value={"on_hand_quantity": before}, new_value={"on_hand_quantity": int(new_quantity), "reason": reason},
            request=request,
        )
        return Response(InventorySerializer(inventory).data)
