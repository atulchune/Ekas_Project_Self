from celery import shared_task
from django.utils import timezone

from .models import BlogPost, HomepageSection, Recipe


@shared_task
def publish_scheduled_content():
    now = timezone.now()
    published = 0
    for model in (HomepageSection, Recipe, BlogPost):
        qs = model.objects.filter(status=model.SCHEDULED, publish_at__lte=now)
        published += qs.update(status=model.PUBLISHED, published_at=now)
    return published
