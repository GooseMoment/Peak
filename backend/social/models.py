from django.db import models

import uuid

from users.models import User
from tasks.models import Task

class Emoji(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField()
    img_uri = models.URLField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField()

class Peck(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
    )
    count = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField()

class DailyComment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    comment = models.TextField()
    date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField()

class Reaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    parent_type = models.CharField()
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
    )
    daily_comment = models.ForeignKey(
        DailyComment,
        on_delete=models.CASCADE,
    )
    emoji = models.ManyToManyField(Emoji)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField()

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
    )
    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField()

class Following(models.Model):
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
    deleted_at = models.DateTimeField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["follower", "followee"], name="constraint_follower_followee"),
        ]

class Block(models.Model):
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
    deleted_at = models.DateTimeField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["blocker", "blockee"], name="constraint_blocker_blockee"),
        ]
