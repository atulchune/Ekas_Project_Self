from django.db.models import Avg, Count
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from apps.catalog.models import Product

from .models import Review


@receiver([post_save, post_delete], sender=Review)
def recompute_product_rating(sender, instance, **kwargs):
    aggregate = Review.objects.filter(product=instance.product, status=Review.APPROVED).aggregate(
        avg=Avg("rating"), count=Count("id")
    )
    Product.objects.filter(pk=instance.product_id).update(
        average_rating=aggregate["avg"] or 0, review_count=aggregate["count"] or 0
    )
