"""Shipping-provider interface. `mock` is the local/dev default and simply
computes flat/free shipping from store settings; a Shiprocket-backed
provider can implement the same interface without touching call sites."""
from abc import ABC, abstractmethod

from django.conf import settings

from .models import ServiceablePincode


class ShippingProvider(ABC):
    @abstractmethod
    def check_serviceability(self, pincode):
        ...

    @abstractmethod
    def calculate_fee(self, subtotal, free_shipping_override=False):
        ...

    @abstractmethod
    def create_shipment(self, order):
        ...


class MockShippingProvider(ShippingProvider):
    def check_serviceability(self, pincode):
        try:
            record = ServiceablePincode.objects.get(pincode=pincode)
            return {
                "serviceable": record.is_serviceable,
                "cod_available": record.cod_available,
                "estimated_days": record.estimated_days,
                "city": record.city,
                "state": record.state,
            }
        except ServiceablePincode.DoesNotExist:
            # Unknown pincodes default to serviceable with a conservative ETA
            # so the storefront never hard-blocks checkout in local/dev data.
            return {"serviceable": True, "cod_available": settings.COD_ENABLED, "estimated_days": 5, "city": "", "state": ""}

    def calculate_fee(self, subtotal, free_shipping_override=False):
        if free_shipping_override or subtotal >= settings.FREE_SHIPPING_THRESHOLD:
            return 0
        return settings.FLAT_SHIPPING_FEE

    def create_shipment(self, order):
        from .models import Shipment

        shipment, _ = Shipment.objects.get_or_create(order=order)
        return shipment


def get_shipping_provider() -> ShippingProvider:
    if settings.SHIPPING_PROVIDER == "shiprocket":
        # Placeholder: real Shiprocket credentials are required; fall back to
        # mock so the stack always runs locally.
        return MockShippingProvider()
    return MockShippingProvider()
