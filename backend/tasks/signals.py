from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import Task


@receiver(pre_save, sender=Task)
def set_new_task_order(instance: Task, **kwargs):
    if instance.created_at is not None:
        return
    
    last_task = (
        Task.objects.filter(user=instance.user, drawer=instance.drawer)
        .order_by("-order")
        .first()
    )
    instance.order = (last_task.order + 1) if last_task else 0
