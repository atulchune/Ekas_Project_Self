from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .cache import bump_catalog_version
from .models import Bundle, Category, Product, ProductImage, ProductVariant


@receiver([post_save, post_delete], sender=Product)
@receiver([post_save, post_delete], sender=Category)
@receiver([post_save, post_delete], sender=ProductVariant)
@receiver([post_save, post_delete], sender=ProductImage)
@receiver([post_save, post_delete], sender=Bundle)
def invalidate_catalog_cache(sender, **kwargs):
    bump_catalog_version()
