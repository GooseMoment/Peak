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


class Peck(Base):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
    )
    count = models.IntegerField()

    def __str__(self) -> str:
        return f"{self.count} pecks by {self.user} → '{self.task.name}'"

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- Base.Meta
        db_table = "pecks"


class Quote(Base):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    content = models.TextField()
    date = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"Quote of {self.date} by {self.user}"

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- Base.Meta
        db_table = "quotes"


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


class Reaction(Base):
    FOR_TASK = "task"
    FOR_QUOTE = "quote"

    REACTION_TYPE = [
        (FOR_TASK, "For task"),
        (FOR_QUOTE, "For quote"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reactions",
    )
    parent_type = models.CharField(choices=REACTION_TYPE, max_length=128)
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="reactions",
    )
    quote = models.ForeignKey(
        Quote,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    emoji = models.ForeignKey(
        Emoji,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )

    def __str__(self) -> str:
        return f"{self.emoji} by {self.user} → {self.quote or self.task}"

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- Base.Meta
        db_table = "reactions"


class Comment(Base):
    FOR_TASK = "task"
    FOR_QUOTE = "quote"

    COMMENT_TYPE = [
        (FOR_TASK, "For task"),
        (FOR_QUOTE, "For quote"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    parent_type = models.CharField(choices=COMMENT_TYPE, max_length=128)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True)
    quote = models.ForeignKey(
        Quote,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    comment = models.TextField()

    def __str__(self) -> str:
        return f"Comment by {self.user} → {self.quote or self.task}"

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- Base.Meta
        db_table = "comments"


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
