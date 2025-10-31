from django.db import models

from api.models import Base
from users.models import User
from tasks.models import Task

import os


def get_file_path(instance, filename):
    ext = filename.split(".")[-1]
    filename = "%s.%s" % (instance.name, ext)
    return os.path.join("emojis", filename)


class Emoji(Base):
    name = models.CharField(max_length=128)
    img = models.ImageField(
        upload_to=get_file_path,
        null=True,
        blank=True,
    )

    def __str__(self) -> str:
        return f":{self.name}:"

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- Base.Meta
        db_table = "emojis"


class Remark(Base):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    content = models.TextField()
    date = models.DateField()

    def __str__(self) -> str:
        return f"Remark: {self.user}/{self.date}"

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- Base.Meta
        db_table = "remarks"

        constraints = [
            models.UniqueConstraint(
                fields=["user", "date"], name="constraint_user_date"
            ),
        ]


class ReactionBase(Base):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )

    image_emoji = models.ForeignKey(
        Emoji,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )
    # currently length of the longest emoji is 8, but as joined emojis can be defined with longer combinations, we set this to 16
    # assert len("👩🏼‍❤️‍👨🏾") == 8
    unicode_emoji = models.CharField(max_length=16, null=True, blank=True)

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- Base.Meta
        abstract = True
        constraints = [
            models.UniqueConstraint(
                fields=("user", "task", "unicode_emoji"),
                condition=models.Q(image_emoji__isnull=True),
                name="%(app_label)s_%(class)s_user_task_unicode_emoji_unique",
            ),
            models.UniqueConstraint(
                fields=("user", "task", "image_emoji"),
                condition=models.Q(unicode_emoji__isnull=True),
                name="%(app_label)s_%(class)s_user_task_image_emoji_unique",
            ),
            models.CheckConstraint(
                check=models.Q(image_emoji__isnull=True, unicode_emoji__isnull=False)
                | models.Q(image_emoji__isnull=False, unicode_emoji__isnull=True),
                name="%(app_label)s_%(class)s_emojis_exclusive",
            ),
        ]


class TaskReaction(ReactionBase):
    task = models.ForeignKey(
        Task,
        related_name="reactions",
        on_delete=models.CASCADE,
    )

    def __str__(self) -> str:
        return f"TaskReaction: {self.user}/{self.task}/{self.unicode_emoji or self.image_emoji}"

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ReactionBase
        db_table = "task_reactions"
        constraints = ReactionBase.Meta.constraints


class Following(models.Model):  # Base 상속 시 id가 생기므로 models.Model 유지
    # 보내는사람
    follower = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="followings"
    )
    # 받는사람
    followee = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="followers"
    )

    REQUESTED = "requested"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    CANCELED = "canceled"

    STATUS_TYPE = [
        (REQUESTED, "request by follower"),
        (ACCEPTED, "accepted by followee"),
        (REJECTED, "rejected by followee"),
        (CANCELED, "canceled by follower"),
    ]

    status = models.CharField(choices=STATUS_TYPE, max_length=128)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"Following {self.follower} → {self.followee} (status: {self.status})"

    class Meta:
        db_table = "followings"

        constraints = [
            models.UniqueConstraint(
                fields=["follower", "followee"], name="constraint_follower_followee"
            ),
        ]


class Block(models.Model):  # Base 상속 시 id가 생기므로 models.Model 유지
    blocker = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blockees")
    blockee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blockers")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"Block {self.blocker} → {self.blockee}"

    class Meta:
        db_table = "blocks"

        constraints = [
            models.UniqueConstraint(
                fields=["blocker", "blockee"], name="constraint_blocker_blockee"
            ),
        ]
