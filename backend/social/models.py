from django.db import models

import uuid

from api.models import Base
from users.models import User
from tasks.models import Task

class Emoji(Base):
    name = models.CharField(max_length=128)
    img_uri = models.URLField()

    def __str__(self) -> str:
        return f":{self.name}:"

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
        return f"{self.count} pecks by @{self.user.username} → '{self.task.name}'"

class DailyComment(Base):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    comment = models.TextField()
    date = models.DateField()

    def __str__(self) -> str:
        return f"DailyComment of {self.date} by @{self.user.username}"

class Reaction(Base):
    FOR_TASK = "task"
    FOR_DAILY_COMMENT = "daily_comment"

    REACTION_TYPE = [
        (FOR_TASK, "For task"),
        (FOR_DAILY_COMMENT, "For daily comment"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    parent_type = models.CharField(choices=REACTION_TYPE, max_length=128)
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    daily_comment = models.ForeignKey(
        DailyComment,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    emoji = models.ManyToManyField(Emoji)

    def __str__(self) -> str:
        return f":{self.emoji.name}: by @{self.user.username} → {self.daily_comment or self.task})"

class Comment(Base):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
    )
    comment = models.TextField()

    def __str__(self) -> str:
        return f"Comment by @{self.user.username} → {self.task.name})"

class Following(models.Model): # Base 상속 시 id가 생기므로 models.Model 유지
    # 보내는사람
    follower = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
        related_name = "follower"
    )
    # 받는사람
    followee = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
        related_name = "followee"
    )
    # 요청인가
    is_request = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["follower", "followee"], name="constraint_follower_followee"),
        ]

    def __str__(self) -> str:
        return f"Following @{self.follower} → @{self.followee} (is_request: {self.is_request})"

class Block(models.Model): # Base 상속 시 id가 생기므로 models.Model 유지
    blocker = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
        related_name = "blocker"
    )
    blockee = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
        related_name = "blockee"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, default=None)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["blocker", "blockee"], name="constraint_blocker_blockee"),
        ]

    def __str__(self) -> str:
        return f"Block @{self.blocker} → @{self.blockee}"
