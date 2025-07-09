from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Notification
from social.models import Reaction, Peck, Following, Comment
from .push import pushNotificationToUser

# A receiver for post_save of TaskReminder is intentionally missed.
# Creating Notifications for TaskReminder is being done by a Command notifyreminders.


@receiver(post_save, sender=Reaction)
def create_notification_for_reaction(instance: Reaction, created=False, **kwargs):
    if not created:
        return

    target_user = None
    noti_type = Notification.FOR_REACTION

    if instance.parent_type == Reaction.FOR_TASK and instance.task is not None:
        target_user = instance.task.user
    elif instance.parent_type == Reaction.FOR_QUOTE and instance.quote is not None:
        target_user = instance.quote.user

    if target_user == instance.user:
        return

    return Notification.objects.create(
        user=target_user,
        reaction=instance,
        type=noti_type,
    )


@receiver(post_save, sender=Peck)
def create_notification_for_peck(instance: Peck, **kwargs):
    # create peck notification when Peck is created & updated

    target_user = instance.task.user
    noti_type = Notification.FOR_PECK

    if target_user == instance.user:
        return

    return Notification.objects.create(
        user=target_user,
        peck=instance,
        type=noti_type,
    )


@receiver(post_save, sender=Following)
def create_notification_for_following(instance: Following, **kwargs):
    match instance.status:
        case Following.REQUESTED:
            Notification.objects.create(
                user=instance.followee,
                type=Notification.FOR_FOLLOW_REQUEST,
                following=instance,
                created_at=instance.created_at,
            )
        case Following.ACCEPTED:
            Notification.objects.create(
                user=instance.follower,
                type=Notification.FOR_FOLLOW_REQUEST_ACCEPTED,
                following=instance,
                created_at=instance.created_at,
            )

            Notification.objects.create(
                user=instance.followee,
                type=Notification.FOR_FOLLOW,
                following=instance,
                created_at=instance.updated_at,
            )
        case Following.REJECTED, Following.CANCELED:
            # no notification for these types
            pass


@receiver(post_save, sender=Comment)
def create_notification_for_comment(instance: Comment, created=False, **kwargs):
    if not created:
        return

    parent_owner = None
    if instance.parent_type == Comment.FOR_TASK:
        parent_owner = instance.task.user if instance.task else None
    else:
        parent_owner = instance.quote.user if instance.quote else None

    if parent_owner == instance.user or parent_owner is None:
        return

    return Notification.objects.create(
        user=parent_owner,
        type=Notification.FOR_COMMENT,
        comment=instance,
        created_at=instance.created_at,
    )


@receiver(post_save, sender=Notification)
def push_notification(instance: Notification, created=False, **kwargs):
    if not created or instance.user is None:
        return

    pushNotificationToUser(instance.user, instance)
