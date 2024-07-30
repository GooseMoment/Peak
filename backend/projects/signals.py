from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Project
from users.models import User

@receiver(post_save, sender=User)
def create_inbox(sender, instance: User=None, created=False, **kwargs):
    if not created:
        return
    
    return Project.objects.create(
        name="Inbox", user=instance, order=0, color="cccccc", type="inbox",  
    )