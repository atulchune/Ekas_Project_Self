from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import Address, CustomerProfile, LoginHistory

from .audit import log_action
from .base import OperationsModelViewSet
from .permissions import HasOperationsPermission, IsOperationsStaff


class CustomerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"


class CustomerSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    full_name = serializers.CharField(source="user.full_name", read_only=True)
    phone = serializers.CharField(source="user.phone", read_only=True)
    is_active = serializers.BooleanField(source="user.is_active", read_only=True)
    date_joined = serializers.DateTimeField(source="user.date_joined", read_only=True)
    addresses = serializers.SerializerMethodField()

    class Meta:
        model = CustomerProfile
        fields = [
            "id", "email", "full_name", "phone", "is_active", "date_joined", "accepts_marketing",
            "notify_order_updates", "notify_promotions", "total_orders", "total_spent",
            "internal_notes", "is_disabled", "addresses",
        ]

    def get_addresses(self, obj):
        return CustomerAddressSerializer(obj.user.addresses.all(), many=True).data


class CustomerOpsViewSet(OperationsModelViewSet):
    queryset = CustomerProfile.objects.select_related("user").all()
    serializer_class = CustomerSerializer
    resource_type = "customer"
    view_permission_code = "customers.view"
    manage_permission_code = "customers.manage"
    http_method_names = ["get", "patch", "head", "options"]
    search_fields = ["user__email", "user__first_name", "user__last_name", "user__phone"]


class CustomerDeactivateView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "customers.manage"

    def post(self, request, pk):
        profile = CustomerProfile.objects.select_related("user").get(pk=pk)
        active = request.data.get("is_active", False)
        profile.user.is_active = bool(active)
        profile.user.save(update_fields=["is_active"])
        profile.is_disabled = not bool(active)
        profile.save(update_fields=["is_disabled"])
        log_action(
            staff=request.user, action="deactivate" if not active else "reactivate", resource_type="customer",
            resource_id=str(profile.pk), new_value={"is_active": bool(active)}, request=request,
        )
        return Response(CustomerSerializer(profile).data)


class CustomerLoginHistoryView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "customers.view"

    def get(self, request, pk):
        profile = CustomerProfile.objects.select_related("user").get(pk=pk)
        history = LoginHistory.objects.filter(user=profile.user).order_by("-created_at")[:50]
        return Response(
            [{"success": h.success, "reason": h.reason, "ip_address": h.ip_address, "created_at": h.created_at} for h in history]
        )
