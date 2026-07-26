import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery("ekas")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

app.conf.beat_schedule = {
    "release-expired-reservations": {
        "task": "apps.orders.tasks.release_expired_reservations_task",
        "schedule": 60.0,
    },
    "send-abandoned-cart-reminders": {
        "task": "apps.engagement.tasks.send_abandoned_cart_reminders",
        "schedule": crontab(minute=0),
    },
    "send-low-stock-alerts": {
        "task": "apps.engagement.tasks.send_low_stock_alerts",
        "schedule": crontab(hour=8, minute=0),
    },
    "publish-scheduled-content": {
        "task": "apps.content.tasks.publish_scheduled_content",
        "schedule": 300.0,
    },
}
