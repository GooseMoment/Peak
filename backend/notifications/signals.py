from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Notification
from social.models import TaskReaction, Following
from .push import pushNotificationToUser

# A receiver for post_save of TaskReminder is intentionally missed.
# Creating Notifications for TaskReminder is being done by a Command notifyreminders.


@receiver(post_save, sender=TaskReaction)
def create_notification_for_task_reaction(
    instance: TaskReaction, created=False, **kwargs
):
    if not created:
        return

    target_user = instance.task.user

    if target_user == instance.user:
        return

    return Notification.objects.create(
        user=target_user,
        task_reaction=instance,
        type=Notification.FOR_TASK_REACTION,
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


@receiver(post_save, sender=Notification)
def push_notification(instance: Notification, created=False, **kwargs):
    if not created or instance.user is None:
        return

    pushNotificationToUser(instance.user, instance)
