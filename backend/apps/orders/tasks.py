from celery import shared_task


@shared_task
def release_expired_reservations_task():
    from .services import release_expired_reservations

    return release_expired_reservations()
