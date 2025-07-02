from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Task


@receiver(post_save, sender=Task)
def set_new_task_order(sender, instance: Task = None, created=False, **kwargs):
    if not created:
        return

    last_task = (
        Task.objects.filter(user=instance.user, drawer=instance.drawer)
        .order_by("-order")
        .first()
    )
    instance.order = (last_task.order + 1) if last_task else 0

    instance.save()
