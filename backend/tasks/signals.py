from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Task
from drawers.models import Drawer

@receiver(post_save, sender=Task)
def set_task_order(sender, instance: Task=None, created=False, **kwargs):
    if not created:
        return

    drawer_in_task = Drawer.objects.get(id=instance.drawer.id)
    instance.order = drawer_in_task.uncompleted_task_count + drawer_in_task.completed_task_count
    print(instance.order)

    instance.save()
