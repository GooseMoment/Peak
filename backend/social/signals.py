from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver

from .models import Block, Following
from user_setting.models import UserSetting


@receiver(post_save, sender=Block)
def delete_following_for_block(sender, instance, created, **kwargs):
    if created:
        Following.objects.filter(
            followee=instance.blocker, follower=instance.blockee
        ).delete()
        Following.objects.filter(
            followee=instance.blockee, follower=instance.blocker
        ).delete()


@receiver([post_save, post_delete], sender=Following)
def update_follow_count_for_following(sender, instance: Following, **kwargs):
    instance.follower.followings_count = Following.objects.filter(
        follower=instance.follower, status=Following.ACCEPTED
    ).count()
    instance.follower.save()

    instance.followee.followers_count = Following.objects.filter(
        followee=instance.followee, status=Following.ACCEPTED
    ).count()
    instance.followee.save()


@receiver(pre_save, sender=Following)
def accept_follow_request_based_on_user_setting(
    sender, instance: Following, created: bool, **kwargs
):
    if instance.status != Following.REQUESTED:
        return

    followee_setting = UserSetting.objects.filter(user=instance.followee).first()
    if followee_setting is None:
        return

    if not followee_setting.follow_request_approval_manually:
        instance.status = Following.ACCEPTED
        return

    if not followee_setting.follow_request_approval_for_followings:
        return

    # get the reversed following
    reversed_following_exists = Following.objects.filter(
        followee=instance.follower,
        follower=instance.followee,
        status=Following.ACCEPTED,
    ).exists()

    if not reversed_following_exists:
        return

    instance.status = Following.ACCEPTED
