"""Server-authoritative discount engine.

Both the cart summary (advisory) and checkout (binding) call this module so
the frontend can never dictate discounts, taxes, or totals -- it only ever
displays what the backend computed.
"""
from decimal import Decimal

from django.utils import timezone

from apps.core.exceptions import ApplicationError

from .models import Coupon, Promotion


def _rule_applies_to_line(rule, line):
    if rule.scope == "all":
        return True
    if rule.scope == "category":
        return rule.categories.filter(pk=line["category_id"]).exists()
    if rule.scope == "product":
        return rule.products.filter(pk=line["product_id"]).exists()
    return False


def _eligible_lines_total(rule, lines):
    return sum((line["line_total"] for line in lines if _rule_applies_to_line(rule, line)), Decimal("0"))


def _discount_amount(rule, base_amount):
    if base_amount <= 0:
        return Decimal("0")
    if rule.discount_type == Coupon.PERCENTAGE:
        amount = base_amount * (rule.discount_value / Decimal("100"))
    else:
        amount = min(rule.discount_value, base_amount)
    if rule.max_discount_amount is not None:
        amount = min(amount, rule.max_discount_amount)
    return amount.quantize(Decimal("0.01"))


def _active_promotions(subtotal):
    now = timezone.now()
    qs = Promotion.objects.filter(is_active=True).filter(min_order_value__lte=subtotal)
    qs = qs.filter(models_q_valid(now))
    return qs.order_by("-priority")


def models_q_valid(now):
    from django.db.models import Q

    return (Q(valid_from__isnull=True) | Q(valid_from__lte=now)) & (Q(valid_to__isnull=True) | Q(valid_to__gte=now))


def validate_coupon(code, user, subtotal):
    now = timezone.now()
    try:
        coupon = Coupon.objects.get(code__iexact=code, is_active=True)
    except Coupon.DoesNotExist:
        raise ApplicationError("This coupon code is not valid.", code="invalid_coupon", status_code=400)

    if coupon.valid_from and coupon.valid_from > now:
        raise ApplicationError("This coupon is not active yet.", code="coupon_not_started", status_code=400)
    if coupon.valid_to and coupon.valid_to < now:
        raise ApplicationError("This coupon has expired.", code="coupon_expired", status_code=400)
    if subtotal < coupon.min_order_value:
        raise ApplicationError(
            f"Add items worth at least Rs. {coupon.min_order_value} to use this coupon.",
            code="coupon_min_order_not_met",
            status_code=400,
        )
    if coupon.usage_limit_total is not None and coupon.times_used >= coupon.usage_limit_total:
        raise ApplicationError("This coupon has reached its usage limit.", code="coupon_exhausted", status_code=400)
    if user is not None and coupon.usage_limit_per_customer is not None:
        used = coupon.usages.filter(user=user).count()
        if used >= coupon.usage_limit_per_customer:
            raise ApplicationError(
                "You have already used this coupon.", code="coupon_already_used", status_code=400
            )
    return coupon


def price_cart(lines, user=None, coupon_code=None):
    """lines: [{"product_id", "category_id", "line_total": Decimal}, ...]

    Returns {"subtotal", "discount_total", "applied_rules": [...], "free_shipping": bool, "coupon": Coupon|None}
    """
    subtotal = sum((line["line_total"] for line in lines), Decimal("0"))
    applied = []
    discount_total = Decimal("0")
    free_shipping = False

    for promo in _active_promotions(subtotal):
        base = _eligible_lines_total(promo, lines)
        amount = _discount_amount(promo, base)
        if amount > 0 or promo.grants_free_shipping:
            applied.append({"type": "promotion", "name": promo.name, "amount": amount})
            discount_total += amount
            free_shipping = free_shipping or promo.grants_free_shipping
        if not promo.stackable:
            break

    coupon = None
    if coupon_code:
        coupon = validate_coupon(coupon_code, user, subtotal)
        base = _eligible_lines_total(coupon, lines)
        amount = _discount_amount(coupon, base)
        applied.append({"type": "coupon", "name": coupon.code, "amount": amount})
        discount_total += amount
        free_shipping = free_shipping or coupon.grants_free_shipping

    discount_total = min(discount_total, subtotal)
    return {
        "subtotal": subtotal,
        "discount_total": discount_total,
        "applied_rules": applied,
        "free_shipping": free_shipping,
        "coupon": coupon,
    }
