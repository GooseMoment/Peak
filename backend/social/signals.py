from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Block, Following

@receiver(post_save, sender=Block)
def delete_following(sender, instance, created, **kwargs):
    if created:
        Following.objects.filter(followee=instance.blocker, follower=instance.blockee).delete()
        Following.objects.filter(followee=instance.blockee, follower=instance.blocker).delete()