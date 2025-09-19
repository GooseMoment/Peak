from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from .models import Project
from users.models import User
from drawers.models import Drawer


@receiver(post_save, sender=User)
def create_inbox(instance: User, created=False, **kwargs):
    if not created:
        return

    project = Project.objects.create(
        name="Inbox",
        user=instance,
        order=0,
        color="grey",
        type="inbox",
        privacy="private",
    )
    return Drawer.objects.create(
        name="Inbox",
        user=instance,
        project=project,
        order=0,
        privacy="private",
    )


@receiver(pre_save, sender=Project)
def set_new_project_order(sender, instance: Project, **kwargs):
    if instance.created_at is not None:
        return

    last_project = Project.objects.filter(user=instance.user).order_by("-order").first()
    instance.order = (last_project.order + 1) if last_project else 0
