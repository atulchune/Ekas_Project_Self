from datetime import timedelta

from django.db.models import Avg, Count, Sum
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import CustomerProfile
from apps.inventory.models import Inventory
from apps.orders.models import Order
from apps.payments.models import Payment
from apps.promotions.models import CouponUsage

from .models import AuditLog
from .permissions import HasOperationsPermission, IsOperationsStaff


class DashboardView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "dashboard.view"

    def get(self, request):
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = today_start - timedelta(days=today_start.weekday())
        month_start = today_start.replace(day=1)

        confirmed_orders = Order.objects.exclude(status__in=[Order.PENDING_PAYMENT, Order.PAYMENT_FAILED, Order.CANCELLED])

        def sales_since(start):
            agg = confirmed_orders.filter(placed_at__gte=start).aggregate(total=Sum("total"), count=Count("id"))
            return {"revenue": agg["total"] or 0, "orders": agg["count"] or 0}

        best_sellers = (
            confirmed_orders.values("items__product_name")
            .annotate(units=Sum("items__quantity"))
            .order_by("-units")[:5]
        )
        low_stock = Inventory.objects.filter(on_hand_quantity__lte=10).select_related("variant__product")[:10]

        aov = confirmed_orders.aggregate(avg=Avg("total"))["avg"] or 0

        payment_stats = Payment.objects.values("status").annotate(count=Count("id"))

        return Response(
            {
                "sales_today": sales_since(today_start),
                "sales_week": sales_since(week_start),
                "sales_month": sales_since(month_start),
                "pending_fulfilment": confirmed_orders.filter(status=Order.CONFIRMED).count(),
                "cancellations": Order.objects.filter(status=Order.CANCELLED).count(),
                "refunds": Order.objects.filter(status=Order.REFUNDED).count(),
                "average_order_value": aov,
                "best_sellers": [{"product_name": b["items__product_name"], "units_sold": b["units"]} for b in best_sellers],
                "low_stock_variants": [
                    {"sku": i.variant.sku, "product": i.variant.product.name, "available": i.available_quantity}
                    for i in low_stock
                ],
                "new_customers_month": CustomerProfile.objects.filter(created_at__gte=month_start).count(),
                "repeat_customers": CustomerProfile.objects.filter(total_orders__gt=1).count(),
                "coupon_usage_month": CouponUsage.objects.filter(created_at__gte=month_start).count(),
                "payment_status_breakdown": {p["status"]: p["count"] for p in payment_stats},
                "recent_orders": [
                    {"order_number": o.order_number, "total": o.total, "status": o.status, "placed_at": o.placed_at}
                    for o in Order.objects.order_by("-placed_at")[:10]
                ],
                "recent_staff_activity": [
                    {
                        "staff": log.staff.email if log.staff else "system",
                        "action": log.action,
                        "resource_type": log.resource_type,
                        "created_at": log.created_at,
                    }
                    for log in AuditLog.objects.select_related("staff").order_by("-created_at")[:10]
                ],
            }
        )
