from django.db import models

import uuid

from ..users.models import User
from ..tasks.models import Task

class Emoji(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField()
    img_uri = models.URLField()

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

class DailyComment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    comment = models.TextField()
    date = models.DateField()

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

class Following(models.Model):
    # 보내는사람
    follower = models.OneToOneField(
        User,
        on_delete = models.CASCADE,
    )
    # 받는사람
    followee = models.OneToOneField(
        User,
        on_delete = models.CASCADE,
    )
    # 요청인가
    is_request = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["follower", "followee"], name="constraint_follower_followee"),
        ]

class Block(models.Model):
    blocker = models.OneToOneField(
        User,
        on_delete = models.CASCADE,
    )
    blockee = models.OneToOneField(
        User,
        on_delete = models.CASCADE,
    )
