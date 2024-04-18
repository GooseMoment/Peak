from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

from api.models import Base, PrivacyMixin
from users.models import User
from social.models import Emoji

class UserSetting(Base):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="setting",
    )
    follow_request_approval_manually = models.BooleanField(default=False)
    follow_request_approval_for_followings = models.BooleanField(default=True)
    follow_list_privacy = models.CharField(max_length=128, default=PrivacyMixin.FOR_PUBLIC, choices=PrivacyMixin.PRIVACY_TYPES)
    favorite_emojis = models.ManyToManyField(
        to=Emoji,
        related_name="favorites",
        blank=True,
    )
    dislikable_emojis = models.ManyToManyField(
        to=Emoji,
        related_name="dislikables",
        blank=True,
    )

    def __str__(self) -> str:
        return f"UserSetting of {self.user}"

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_setting(sender, instance=None, created=False, **kwargs):
    if created:
        UserSetting.objects.create(user=instance)
