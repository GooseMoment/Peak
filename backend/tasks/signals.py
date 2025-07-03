from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Task


@receiver(post_save, sender=Task)
def set_new_task_order(instance: Task, created=False, **kwargs):
    if not created:
        return

    tasks_in_same_drawer = Task.objects.filter(drawer=instance.drawer.id)
    instance.order = tasks_in_same_drawer.count() - 1

    instance.save()
