from django.db import transaction

from apps.core.exceptions import ApplicationError

from .models import Inventory, InventoryMovement


def _log_movement(inventory, movement_type, on_hand_delta=0, reserved_delta=0, reason="", order=None, staff=None):
    InventoryMovement.objects.create(
        variant=inventory.variant,
        movement_type=movement_type,
        on_hand_delta=on_hand_delta,
        reserved_delta=reserved_delta,
        reason=reason,
        order=order,
        staff=staff,
        resulting_on_hand=inventory.on_hand_quantity,
        resulting_reserved=inventory.reserved_quantity,
    )


@transaction.atomic
def reserve_stock(variant_id, quantity, order=None, reason=""):
    """Locks the inventory row and reserves `quantity` units.

    Raises ApplicationError(code="insufficient_stock") rather than allowing
    the caller to oversell -- this is the single choke point checkout must
    go through before an order is confirmed.
    """
    inventory = Inventory.objects.select_for_update().get(variant_id=variant_id)
    if inventory.available_quantity < quantity:
        raise ApplicationError(
            f"Only {inventory.available_quantity} unit(s) of {inventory.variant.sku} are available.",
            code="insufficient_stock",
            status_code=409,
            extra={"variant_id": str(variant_id), "available": inventory.available_quantity},
        )
    inventory.reserved_quantity += quantity
    inventory.save(update_fields=["reserved_quantity", "updated_at"])
    _log_movement(inventory, InventoryMovement.RESERVATION, reserved_delta=quantity, reason=reason, order=order)
    return inventory


@transaction.atomic
def release_reservation(variant_id, quantity, order=None, reason=""):
    inventory = Inventory.objects.select_for_update().get(variant_id=variant_id)
    inventory.reserved_quantity = max(inventory.reserved_quantity - quantity, 0)
    inventory.save(update_fields=["reserved_quantity", "updated_at"])
    _log_movement(
        inventory, InventoryMovement.RESERVATION_RELEASE, reserved_delta=-quantity, reason=reason, order=order
    )
    return inventory


@transaction.atomic
def commit_sale(variant_id, quantity, order=None, reason=""):
    """Converts a reservation into a permanent deduction once payment is confirmed."""
    inventory = Inventory.objects.select_for_update().get(variant_id=variant_id)
    inventory.on_hand_quantity -= quantity
    inventory.reserved_quantity = max(inventory.reserved_quantity - quantity, 0)
    inventory.sold_quantity += quantity
    inventory.save(update_fields=["on_hand_quantity", "reserved_quantity", "sold_quantity", "updated_at"])
    _log_movement(
        inventory, InventoryMovement.SALE, on_hand_delta=-quantity, reserved_delta=-quantity,
        reason=reason, order=order,
    )
    return inventory


@transaction.atomic
def restock(variant_id, quantity, staff=None, reason=""):
    inventory = Inventory.objects.select_for_update().get(variant_id=variant_id)
    inventory.on_hand_quantity += quantity
    inventory.save(update_fields=["on_hand_quantity", "updated_at"])
    _log_movement(inventory, InventoryMovement.RESTOCK, on_hand_delta=quantity, reason=reason, staff=staff)
    return inventory


@transaction.atomic
def adjust_stock(variant_id, new_on_hand_quantity, staff=None, reason=""):
    inventory = Inventory.objects.select_for_update().get(variant_id=variant_id)
    delta = new_on_hand_quantity - inventory.on_hand_quantity
    inventory.on_hand_quantity = new_on_hand_quantity
    inventory.save(update_fields=["on_hand_quantity", "updated_at"])
    _log_movement(inventory, InventoryMovement.ADJUSTMENT, on_hand_delta=delta, staff=staff, reason=reason)
    return inventory


@transaction.atomic
def restock_return(variant_id, quantity, order=None, staff=None, reason="Customer return"):
    inventory = Inventory.objects.select_for_update().get(variant_id=variant_id)
    inventory.on_hand_quantity += quantity
    inventory.save(update_fields=["on_hand_quantity", "updated_at"])
    _log_movement(inventory, InventoryMovement.RETURN, on_hand_delta=quantity, order=order, staff=staff, reason=reason)
    return inventory
