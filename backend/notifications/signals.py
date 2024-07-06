from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Notification, TaskReminder
from social.models import Reaction, Peck, Following, Comment
from .push import pushNotificationToUser

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

@receiver(post_save, sender=Following)
def create_notification_for_following(sender, instance: Following=None, created=False, **kwargs):
    match instance.status:
        case Following.REQUESTED:
            return Notification.objects.create(
                user=instance.followee, type=Notification.FOR_FOLLOW_REQUEST, following=instance, created_at=instance.created_at,
            )
        case Following.ACCEPTED:
            noti1 = Notification.objects.create(
                user=instance.follower, type=Notification.FOR_FOLLOW_REQUEST_ACCEPTED, following=instance, created_at=instance.created_at,
            )

            noti2 = Notification.objects.create(
                user=instance.followee, type=Notification.FOR_FOLLOW, following=instance, created_at=instance.updated_at,
            )

            return (noti1, noti2, )
        case Following.REJECTED, Following.CANCELED:
            # no notification for these types
            pass

@receiver(post_save, sender=Comment)
def create_notification_for_comment(sender, instance: Comment=None, created=False, **kwargs):
    if not created:
        return

    return Notification.objects.create(
        user=instance.task.user, type=Notification.FOR_COMMENT, comment=instance, created_at=instance.created_at,
    )

@receiver(post_save, sender=Notification)
def push_notification(sender, instance: Notification=None, created=False, **kwargs):
    if not created:
        return
    
    pushNotificationToUser(instance.user, instance)
