from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from tasks.models import Task
from drawers.models import Drawer


@receiver(post_save, sender=Task)
def add_task_count_for_Task(instance: Task, created=False, **kwargs):
    if not created:
        return

    if instance.completed_at is None:
        instance.drawer.uncompleted_task_count += 1
    else:
        instance.drawer.completed_task_count += 1

    instance.drawer.save()


@receiver(post_delete, sender=Task)
def delete_task_count_for_Task(instance: Task, **kwargs):
    if instance.completed_at is None:
        instance.drawer.uncompleted_task_count -= 1
    else:
        instance.drawer.completed_task_count -= 1

    instance.drawer.save()


@receiver(post_save, sender=Drawer)
def set_new_drawer_order(instance: Drawer, created=False, **kwargs):
    if not created:
        return

    last_drawer = (
        Drawer.objects.filter(user=instance.user, project=instance.project)
        .order_by("-order")
        .first()
    )
    instance.order = (last_drawer.order + 1) if last_drawer else 0

    instance.save()
