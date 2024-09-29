from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from tasks.models import Task

@receiver(post_save, sender=Task)
def add_task_count_for_Task(sender, instance: Task=None, created=False, **kwargs):
    if not created:
        return

    if instance.completed_at is None:
        instance.drawer.uncompleted_task_count += 1
    else:
        instance.drawer.completed_task_count += 1

    instance.drawer.save()

@receiver(post_delete, sender=Task)
def delete_task_count_for_Task(sender, instance: Task=None, **kwargs):
    if instance.completed_at is None:
        instance.drawer.uncompleted_task_count -= 1
    else:
        instance.drawer.completed_task_count -= 1

    instance.drawer.save()
        