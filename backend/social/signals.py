from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import Block, Following


def update_users_follow_counts(instance: Following):
    instance.follower.followings_count = Following.objects.filter(
        follower=instance.follower, status=Following.ACCEPTED
    ).count()
    instance.follower.save()

    instance.followee.followers_count = Following.objects.filter(
        followee=instance.followee, status=Following.ACCEPTED
    ).count()
    instance.followee.save()


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
    update_users_follow_counts(instance)
