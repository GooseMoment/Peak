from django.db.models.signals import pre_save
from django.dispatch import receiver
import marko

from .models import Announcement


@receiver(pre_save, sender=Announcement)
def render_announcement_content_markdown(
    sender, instance: Announcement, *args, **kwargs
):
    instance.content = marko.convert(instance.content_raw)
