from django.db.models.signals import pre_save
from django.dispatch import receiver
import marko

from .models import Announcement

@receiver(pre_save, sender=Announcement)
def delete_following(sender, instance: Announcement, *args, **kwargs):
    instance.content = marko.convert(instance.content_raw)
