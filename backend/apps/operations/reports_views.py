import csv

from django.http import HttpResponse
from django.utils.dateparse import parse_date
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.inventory.models import Inventory
from apps.orders.models import Order
from apps.payments.models import Payment
from apps.promotions.models import CouponUsage

from .models import ReportExport
from .permissions import HasOperationsPermission, IsOperationsStaff

REPORT_BUILDERS = {}


def report(name):
    def decorator(fn):
        REPORT_BUILDERS[name] = fn
        return fn

    return decorator


def _date_range(request):
    start = parse_date(request.query_params.get("start", "")) if request.query_params.get("start") else None
    end = parse_date(request.query_params.get("end", "")) if request.query_params.get("end") else None
    return start, end


@report("sales")
def build_sales_report(request):
    start, end = _date_range(request)
    qs = Order.objects.exclude(status__in=[Order.PENDING_PAYMENT, Order.PAYMENT_FAILED])
    if start:
        qs = qs.filter(placed_at__date__gte=start)
    if end:
        qs = qs.filter(placed_at__date__lte=end)
    header = ["order_number", "placed_at", "status", "payment_method", "subtotal", "discount_total", "shipping_fee", "tax_total", "total"]
    rows = [[o.order_number, o.placed_at, o.status, o.payment_method, o.subtotal, o.discount_total, o.shipping_fee, o.tax_total, o.total] for o in qs]
    return header, rows


@report("inventory")
def build_inventory_report(request):
    qs = Inventory.objects.select_related("variant", "variant__product")
    header = ["sku", "product", "variant", "on_hand", "reserved", "available", "sold", "low_stock_threshold"]
    rows = [
        [i.variant.sku, i.variant.product.name, i.variant.label, i.on_hand_quantity, i.reserved_quantity, i.available_quantity, i.sold_quantity, i.low_stock_threshold]
        for i in qs
    ]
    return header, rows


@report("payments")
def build_payments_report(request):
    qs = Payment.objects.select_related("order")
    header = ["order_number", "provider", "status", "amount", "provider_payment_id", "created_at"]
    rows = [[p.order.order_number, p.provider, p.status, p.amount, p.provider_payment_id, p.created_at] for p in qs]
    return header, rows


@report("coupons")
def build_coupons_report(request):
    qs = CouponUsage.objects.select_related("coupon", "user", "order")
    header = ["coupon_code", "customer_email", "order_number", "discount_amount", "created_at"]
    rows = [[u.coupon.code, u.user.email, u.order.order_number if u.order else "", u.discount_amount, u.created_at] for u in qs]
    return header, rows


@report("customers")
def build_customers_report(request):
    from apps.accounts.models import CustomerProfile

    qs = CustomerProfile.objects.select_related("user")
    header = ["email", "full_name", "total_orders", "total_spent", "date_joined"]
    rows = [[c.user.email, c.user.full_name, c.total_orders, c.total_spent, c.user.date_joined] for c in qs]
    return header, rows


@report("newsletter")
def build_newsletter_report(request):
    from apps.engagement.models import NewsletterSubscriber

    qs = NewsletterSubscriber.objects.all()
    header = ["email", "is_active", "source", "created_at"]
    rows = [[s.email, s.is_active, s.source, s.created_at] for s in qs]
    return header, rows


@report("refunds")
def build_refunds_report(request):
    from apps.payments.models import Refund

    qs = Refund.objects.select_related("order")
    header = ["order_number", "amount", "status", "reason", "created_at"]
    rows = [[r.order.order_number, r.amount, r.status, r.reason, r.created_at] for r in qs]
    return header, rows


class ReportListView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "reports.view"

    def get(self, request):
        return Response({"available_reports": list(REPORT_BUILDERS.keys())})


class ReportExportView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "reports.view"

    def get(self, request, report_type):
        builder = REPORT_BUILDERS.get(report_type)
        if not builder:
            return Response({"error": {"code": "unknown_report", "message": "Unknown report type."}}, status=404)

        header, rows = builder(request)
        ReportExport.objects.create(
            requested_by=request.user, report_type=report_type,
            filters={"start": request.query_params.get("start", ""), "end": request.query_params.get("end", "")},
            status=ReportExport.READY,
        )
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f'attachment; filename="{report_type}_report.csv"'
        writer = csv.writer(response)
        writer.writerow(header)
        writer.writerows(rows)
        return response
