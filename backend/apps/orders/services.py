from datetime import timedelta
from decimal import Decimal

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.cart.models import Cart
from apps.core.exceptions import ApplicationError
from apps.inventory import services as inventory_services
from apps.inventory.models import Inventory
from apps.promotions.models import CouponUsage
from apps.promotions.services import price_cart
from apps.shipping.providers import get_shipping_provider

from .models import Order, OrderItem, OrderStatusHistory


def _cart_lines(cart):
    lines = []
    for item in cart.items.select_related("variant", "variant__product", "variant__product__category").all():
        variant = item.variant
        lines.append(
            {
                "cart_item": item,
                "variant": variant,
                "product_id": variant.product_id,
                "category_id": variant.product.category_id,
                "quantity": item.quantity,
                "unit_price": variant.price,
                "line_total": variant.price * item.quantity,
            }
        )
    return lines


@transaction.atomic
def checkout(*, user, cart: Cart, address, billing_address, payment_method, coupon_code, idempotency_key):
    existing = Order.objects.filter(idempotency_key=idempotency_key).first()
    if existing:
        return existing, False

    cart = Cart.objects.select_for_update().get(pk=cart.pk)
    lines = _cart_lines(cart)
    if not lines:
        raise ApplicationError("Your cart is empty.", code="empty_cart", status_code=400)

    for line in lines:
        if not line["variant"].is_active:
            raise ApplicationError(
                f"{line['variant'].product.name} ({line['variant'].label}) is no longer available.",
                code="variant_unavailable",
                status_code=409,
            )

    pricing = price_cart(lines, user=user, coupon_code=coupon_code)
    taxable_amount = pricing["subtotal"] - pricing["discount_total"]
    shipping_fee = get_shipping_provider().calculate_fee(taxable_amount, pricing["free_shipping"])
    tax_total = (taxable_amount * Decimal(settings.DEFAULT_TAX_RATE_PERCENT) / Decimal("100")).quantize(Decimal("0.01"))
    total = taxable_amount + shipping_fee + tax_total

    if payment_method == Order.COD and not settings.COD_ENABLED:
        raise ApplicationError("Cash on delivery is currently unavailable.", code="cod_disabled", status_code=400)

    is_cod = payment_method == Order.COD
    order = Order.objects.create(
        user=user,
        status=Order.CONFIRMED if is_cod else Order.PENDING_PAYMENT,
        payment_method=payment_method,
        idempotency_key=idempotency_key,
        shipping_full_name=address.full_name,
        shipping_phone=address.phone,
        shipping_line1=address.line1,
        shipping_line2=address.line2,
        shipping_city=address.city,
        shipping_state=address.state,
        shipping_pincode=address.pincode,
        shipping_country=address.country,
        billing_same_as_shipping=billing_address is None,
        billing_full_name=(billing_address or address).full_name,
        billing_phone=(billing_address or address).phone,
        billing_line1=(billing_address or address).line1,
        billing_line2=(billing_address or address).line2,
        billing_city=(billing_address or address).city,
        billing_state=(billing_address or address).state,
        billing_pincode=(billing_address or address).pincode,
        subtotal=pricing["subtotal"],
        discount_total=pricing["discount_total"],
        shipping_fee=shipping_fee,
        tax_total=tax_total,
        total=total,
        coupon_code=coupon_code or "",
        confirmed_at=timezone.now() if is_cod else None,
        reservation_expires_at=None if is_cod else timezone.now() + timedelta(minutes=settings.RESERVATION_EXPIRY_MINUTES),
    )
    OrderStatusHistory.objects.create(order=order, from_status="", to_status=order.status, note="Order placed")

    for line in lines:
        OrderItem.objects.create(
            order=order,
            variant=line["variant"],
            product_name=line["variant"].product.name,
            variant_label=line["variant"].label,
            sku=line["variant"].sku,
            quantity=line["quantity"],
            unit_price=line["unit_price"],
            line_total=line["line_total"],
        )
        inventory_services.reserve_stock(line["variant"].id, line["quantity"], order=order, reason=f"Order {order.order_number}")
        if is_cod:
            inventory_services.commit_sale(line["variant"].id, line["quantity"], order=order, reason=f"Order {order.order_number} (COD)")

    if pricing["coupon"]:
        coupon = pricing["coupon"]
        CouponUsage.objects.create(
            coupon=coupon, user=user, order=order,
            discount_amount=next((r["amount"] for r in pricing["applied_rules"] if r["type"] == "coupon"), Decimal("0")),
        )
        coupon.times_used += 1
        coupon.save(update_fields=["times_used"])

    cart.status = Cart.CONVERTED
    cart.save(update_fields=["status"])
    cart.items.all().delete()

    return order, True


@transaction.atomic
def confirm_paid_order(order: Order):
    if order.status != Order.PENDING_PAYMENT:
        return order
    for item in order.items.select_related("variant"):
        inventory_services.commit_sale(item.variant_id, item.quantity, order=order, reason=f"Order {order.order_number} payment confirmed")
    order.status = Order.CONFIRMED
    order.confirmed_at = timezone.now()
    order.save(update_fields=["status", "confirmed_at"])
    OrderStatusHistory.objects.create(order=order, from_status=Order.PENDING_PAYMENT, to_status=Order.CONFIRMED, note="Payment verified")
    return order


@transaction.atomic
def release_failed_order(order: Order, reason="Payment failed"):
    if order.status != Order.PENDING_PAYMENT:
        return order
    for item in order.items.select_related("variant"):
        inventory_services.release_reservation(item.variant_id, item.quantity, order=order, reason=reason)
    order.status = Order.PAYMENT_FAILED
    order.save(update_fields=["status"])
    OrderStatusHistory.objects.create(order=order, from_status=Order.PENDING_PAYMENT, to_status=Order.PAYMENT_FAILED, note=reason)
    return order


@transaction.atomic
def release_expired_reservations():
    expired = Order.objects.select_for_update().filter(
        status=Order.PENDING_PAYMENT, reservation_expires_at__lt=timezone.now()
    )
    count = 0
    for order in expired:
        release_failed_order(order, reason="Payment reservation expired")
        count += 1
    return count


@transaction.atomic
def cancel_order(order: Order, *, staff=None, reason=""):
    if order.status in (Order.CANCELLED, Order.DELIVERED, Order.REFUNDED):
        raise ApplicationError("This order can no longer be cancelled.", code="order_not_cancellable", status_code=409)
    for item in order.items.select_related("variant"):
        if order.status == Order.PENDING_PAYMENT:
            inventory_services.release_reservation(item.variant_id, item.quantity, order=order, reason=reason)
        else:
            inventory_services.restock_return(item.variant_id, item.quantity, order=order, staff=staff, reason=reason or "Order cancelled")
    from_status = order.status
    order.status = Order.CANCELLED
    order.cancelled_at = timezone.now()
    order.cancellation_reason = reason
    order.save(update_fields=["status", "cancelled_at", "cancellation_reason"])
    OrderStatusHistory.objects.create(order=order, from_status=from_status, to_status=Order.CANCELLED, changed_by=staff, note=reason)
    return order


@transaction.atomic
def transition_status(order: Order, new_status, *, staff=None, note=""):
    valid_forward = {
        Order.CONFIRMED: [Order.PACKED, Order.CANCELLED],
        Order.PACKED: [Order.SHIPPED, Order.CANCELLED],
        Order.SHIPPED: [Order.OUT_FOR_DELIVERY, Order.DELIVERED],
        Order.OUT_FOR_DELIVERY: [Order.DELIVERED],
    }
    allowed = valid_forward.get(order.status, [])
    if new_status not in allowed:
        raise ApplicationError(
            f"Cannot move order from {order.status} to {new_status}.", code="invalid_transition", status_code=409
        )
    from_status = order.status
    order.status = new_status
    order.save(update_fields=["status"])
    OrderStatusHistory.objects.create(order=order, from_status=from_status, to_status=new_status, changed_by=staff, note=note)
    return order
