from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Notification
# TODO: Add Following here after Following.status added
from social.models import Reaction, Peck
from .push import pushNotificationToUser

# TODO: add code for TaskReminder

@receiver(post_save, sender=Reaction)
def create_notification_for_reaction(sender, instance: Reaction=None, created=False, **kwargs):
    if not created:
        return

    target_user = None
    noti_type = Notification.FOR_REACTION

    if instance.parent_type == Reaction.FOR_TASK:
        target_user = instance.task.user
    elif instance.parent_type == Reaction.FOR_DAILY_COMMENT:
        target_user = instance.daily_comment.user

    return Notification.objects.create(
        user=target_user, reaction=instance, type=noti_type,
    )

@receiver(post_save, sender=Peck)
def create_notification_for_peck(sender, instance: Peck=None, created=False, **kwargs):
    # create peck notification when Peck is created & updated

    target_user = instance.task.user
    noti_type = Notification.FOR_PECK

    return Notification.objects.create(
        user=target_user, peck=instance, type=noti_type,
    )

@receiver(post_save, sender=Notification)
def push_notification(sender, instance: Notification=None, created=False, **kwargs):
    if not created:
        return
    
    pushNotificationToUser(instance.user, instance)
