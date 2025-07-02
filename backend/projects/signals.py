from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Project
from users.models import User
from drawers.models import Drawer


@receiver(post_save, sender=User)
def create_inbox(sender, instance: User = None, created=False, **kwargs):
    if not created:
        return

    project = Project.objects.create(
        name="Inbox",
        user=instance,
        order=0,
        color="grey",
        type="inbox",
    )
    return Drawer.objects.create(
        name="Inbox",
        user=instance,
        project=project,
        order=0,
    )

@receiver(post_save, sender=Project)
def set_new_project_order(sender, instance: Project, created=False, **kwargs):
    if not created:
        return

    last_project = (
        Project.objects.filter(user=instance.user)
        .order_by("-order")
        .first()
    )
    instance.order = (last_project.order + 1) if last_project else 0

    instance.save()
