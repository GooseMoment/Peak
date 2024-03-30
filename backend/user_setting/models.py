from django.db import models

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
    )
    dislikable_emojis = models.ManyToManyField(
        to=Emoji,
        related_name="dislikables"
    )
