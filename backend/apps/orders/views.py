from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cart import services as cart_services
from apps.core.exceptions import ApplicationError

from .models import CancellationRequest, Order
from .serializers import (
    CancellationRequestSerializer,
    CheckoutSerializer,
    OrderDetailSerializer,
    OrderListSerializer,
)
from .services import cancel_order, checkout


class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = "checkout"

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        cart, _ = cart_services.get_or_create_cart(request)
        order, created = checkout(
            user=request.user,
            cart=cart,
            address=data["address"],
            billing_address=data["billing_address"],
            payment_method=data["payment_method"],
            coupon_code=data.get("coupon_code") or None,
            idempotency_key=data["idempotency_key"],
        )

        response_data = OrderDetailSerializer(order).data
        if order.payment_method == Order.ONLINE and order.status == Order.PENDING_PAYMENT:
            from apps.payments.services import create_payment_for_order

            payment, provider_payload = create_payment_for_order(order)
            response_data["payment"] = provider_payload
        return Response(response_data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "order_number"

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related(
            "items", "status_history", "shipment"
        )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return OrderDetailSerializer
        return OrderListSerializer


class CancelOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_number):
        try:
            order = Order.objects.get(order_number=order_number, user=request.user)
        except Order.DoesNotExist:
            raise ApplicationError("Order not found.", code="order_not_found", status_code=404)
        reason = request.data.get("reason", "")
        if order.status in (Order.CONFIRMED, Order.PACKED):
            cancel_order(order, reason=reason)
            return Response(OrderDetailSerializer(order).data)
        req = CancellationRequest.objects.create(order=order, requested_by=request.user, reason=reason)
        return Response(CancellationRequestSerializer(req).data, status=status.HTTP_201_CREATED)
