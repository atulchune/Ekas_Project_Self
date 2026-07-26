import uuid

from django.db import transaction

from apps.core.exceptions import ApplicationError
from apps.inventory.models import Inventory

from .models import Cart, CartItem

GUEST_CART_COOKIE = "ekas_guest_cart"


def get_or_create_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user, defaults={"status": Cart.ACTIVE})
        return cart, None

    token = request.COOKIES.get(GUEST_CART_COOKIE)
    if token:
        cart = Cart.objects.filter(guest_token=token, status=Cart.ACTIVE).first()
        if cart:
            return cart, token

    token = uuid.uuid4().hex
    cart = Cart.objects.create(guest_token=token, status=Cart.ACTIVE)
    return cart, token


@transaction.atomic
def merge_guest_cart_into_user(user, guest_token):
    if not guest_token:
        return
    guest_cart = Cart.objects.filter(guest_token=guest_token, status=Cart.ACTIVE).first()
    if not guest_cart:
        return
    user_cart, _ = Cart.objects.get_or_create(user=user, defaults={"status": Cart.ACTIVE})
    for item in guest_cart.items.all():
        existing = user_cart.items.filter(variant=item.variant, bundle=item.bundle).first()
        if existing:
            existing.quantity += item.quantity
            existing.save(update_fields=["quantity"])
        else:
            item.pk = None
            item.cart = user_cart
            item.save()
    guest_cart.status = Cart.MERGED
    guest_cart.save(update_fields=["status"])


def _validate_variant_active(variant):
    if not variant.is_active:
        raise ApplicationError("This product variant is not available.", code="variant_unavailable", status_code=400)


@transaction.atomic
def add_item(cart, variant, quantity=1, bundle=None):
    _validate_variant_active(variant)
    item, created = CartItem.objects.get_or_create(
        cart=cart, variant=variant, bundle=bundle, defaults={"quantity": quantity}
    )
    if not created:
        item.quantity += quantity
        item.save(update_fields=["quantity"])
    return item


@transaction.atomic
def update_item_quantity(cart, item_id, quantity):
    item = cart.items.select_related("variant").get(pk=item_id)
    if quantity <= 0:
        item.delete()
        return None
    item.quantity = quantity
    item.save(update_fields=["quantity"])
    return item


def remove_item(cart, item_id):
    cart.items.filter(pk=item_id).delete()


def cart_summary(cart):
    from apps.promotions.services import price_cart

    lines = []
    for item in cart.items.select_related("variant", "variant__product", "variant__product__category"):
        lines.append(
            {
                "product_id": item.variant.product_id,
                "category_id": item.variant.product.category_id,
                "line_total": item.variant.price * item.quantity,
            }
        )
    if not lines:
        return {"subtotal": 0, "discount_total": 0, "applied_rules": [], "free_shipping": False}
    return price_cart(lines, user=cart.user, coupon_code=cart.coupon_code or None)
