from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import CancellationRequest, InternalOrderNote, Order, OrderItem, OrderStatusHistory
from apps.orders.serializers import OrderItemSerializer, OrderStatusHistorySerializer
from apps.orders.services import cancel_order, transition_status
from apps.payments.models import Payment, Refund
from apps.payments.services import issue_refund
from apps.shipping.models import Shipment

from .audit import log_action
from .base import OperationsModelViewSet
from .permissions import HasOperationsPermission, IsOperationsStaff


class InternalOrderNoteSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source="staff.full_name", read_only=True)

    class Meta:
        model = InternalOrderNote
        fields = ["id", "order", "staff", "staff_name", "note", "created_at"]
        read_only_fields = ["staff"]


class ShipmentSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source="order.order_number", read_only=True)

    class Meta:
        model = Shipment
        fields = "__all__"


class PaymentSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source="order.order_number", read_only=True)

    class Meta:
        model = Payment
        fields = "__all__"


class RefundSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source="order.order_number", read_only=True)

    class Meta:
        model = Refund
        fields = "__all__"
        read_only_fields = ["provider_refund_id", "status", "processed_at", "requested_by"]


class CancellationRequestSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source="order.order_number", read_only=True)
    customer_email = serializers.CharField(source="requested_by.email", read_only=True)

    class Meta:
        model = CancellationRequest
        fields = "__all__"


class OrderOpsSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)
    internal_notes = InternalOrderNoteSerializer(many=True, read_only=True)
    customer_email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Order
        fields = "__all__"


class OrderOpsViewSet(OperationsModelViewSet):
    queryset = Order.objects.select_related("user").prefetch_related(
        "items", "status_history", "internal_notes"
    ).all()
    serializer_class = OrderOpsSerializer
    resource_type = "order"
    view_permission_code = "orders.view"
    manage_permission_code = "orders.manage"
    http_method_names = ["get", "head", "options"]
    filterset_fields = ["status", "payment_method"]
    search_fields = ["order_number", "user__email", "shipping_phone"]
    ordering_fields = ["placed_at", "total"]


class OrderTransitionView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "orders.manage"

    def post(self, request, order_number):
        order = Order.objects.get(order_number=order_number)
        new_status = request.data.get("status")
        note = request.data.get("note", "")
        before = order.status
        order = transition_status(order, new_status, staff=request.user, note=note)
        log_action(
            staff=request.user, action="status_transition", resource_type="order", resource_id=order.order_number,
            previous_value={"status": before}, new_value={"status": order.status, "note": note}, request=request,
        )
        return Response(OrderOpsSerializer(order).data)


class OrderCancelOpsView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "orders.manage"

    def post(self, request, order_number):
        order = Order.objects.get(order_number=order_number)
        reason = request.data.get("reason", "")
        order = cancel_order(order, staff=request.user, reason=reason)
        log_action(staff=request.user, action="cancel", resource_type="order", resource_id=order.order_number, new_value={"reason": reason}, request=request)
        return Response(OrderOpsSerializer(order).data)


class InternalOrderNoteViewSet(OperationsModelViewSet):
    queryset = InternalOrderNote.objects.select_related("staff", "order").all()
    serializer_class = InternalOrderNoteSerializer
    resource_type = "internal_order_note"
    view_permission_code = "orders.view"
    manage_permission_code = "orders.manage"
    filterset_fields = ["order"]

    def perform_create(self, serializer):
        instance = serializer.save(staff=self.request.user)
        log_action(staff=self.request.user, action="create", resource_type="internal_order_note", resource_id=instance.pk, request=self.request)


class ShipmentOpsViewSet(OperationsModelViewSet):
    queryset = Shipment.objects.select_related("order").all()
    serializer_class = ShipmentSerializer
    resource_type = "shipment"
    view_permission_code = "shipments.view"
    manage_permission_code = "shipments.manage"
    filterset_fields = ["status"]
    search_fields = ["tracking_number", "order__order_number"]

    def perform_update(self, serializer):
        from django.utils import timezone

        before = serializer.instance.status
        instance = serializer.save()
        if instance.status == Shipment.SHIPPED and not instance.shipped_at:
            instance.shipped_at = timezone.now()
            instance.save(update_fields=["shipped_at"])
            instance.order.status = Order.SHIPPED
            instance.order.save(update_fields=["status"])
            OrderStatusHistory.objects.create(order=instance.order, from_status=before, to_status=Order.SHIPPED, changed_by=self.request.user)
        if instance.status == Shipment.DELIVERED and not instance.delivered_at:
            instance.delivered_at = timezone.now()
            instance.save(update_fields=["delivered_at"])
            instance.order.status = Order.DELIVERED
            instance.order.save(update_fields=["status"])
            OrderStatusHistory.objects.create(order=instance.order, from_status=Order.OUT_FOR_DELIVERY, to_status=Order.DELIVERED, changed_by=self.request.user)
        log_action(staff=self.request.user, action="update", resource_type="shipment", resource_id=instance.pk, previous_value={"status": before}, new_value={"status": instance.status}, request=self.request)


class PaymentOpsViewSet(OperationsModelViewSet):
    queryset = Payment.objects.select_related("order").all()
    serializer_class = PaymentSerializer
    resource_type = "payment"
    view_permission_code = "payments.view"
    manage_permission_code = "payments.manage"
    http_method_names = ["get", "head", "options"]
    filterset_fields = ["status", "provider"]
    search_fields = ["order__order_number", "provider_payment_id"]


class RefundOpsViewSet(OperationsModelViewSet):
    queryset = Refund.objects.select_related("order", "payment").all()
    serializer_class = RefundSerializer
    resource_type = "refund"
    view_permission_code = "returns.view"
    manage_permission_code = "returns.manage"
    http_method_names = ["get", "post", "head", "options"]

    def create(self, request, *args, **kwargs):
        order = Order.objects.get(pk=request.data.get("order"))
        refund = issue_refund(
            order=order, amount=request.data.get("amount"), reason=request.data.get("reason", ""), staff=request.user
        )
        log_action(staff=request.user, action="refund", resource_type="order", resource_id=order.order_number, new_value={"amount": str(refund.amount)}, request=request)
        return Response(RefundSerializer(refund).data, status=201)


class CancellationRequestOpsViewSet(OperationsModelViewSet):
    queryset = CancellationRequest.objects.select_related("order", "requested_by").all()
    serializer_class = CancellationRequestSerializer
    resource_type = "cancellation_request"
    view_permission_code = "returns.view"
    manage_permission_code = "returns.manage"
    http_method_names = ["get", "patch", "head", "options"]

    def perform_update(self, serializer):
        from django.utils import timezone

        instance = serializer.save(resolved_by=self.request.user, resolved_at=timezone.now())
        if instance.status == CancellationRequest.APPROVED:
            cancel_order(instance.order, staff=self.request.user, reason=instance.reason)
        log_action(staff=self.request.user, action="resolve", resource_type="cancellation_request", resource_id=instance.pk, new_value={"status": instance.status}, request=self.request)
