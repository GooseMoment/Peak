from django.db import models

import uuid

from users.models import User
from drawers.models import Drawer

class Repeat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # TODO: 자연어로 빠른 Repeat 지정
    startedAt = models.DateTimeField()

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    
    weekdays = models.BinaryField(max_length=7, default=b'0000000')
    week_frequency = models.IntegerField(default=0)
    month = models.IntegerField(default=0)
    day = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, default=None)

class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=128)
    privacy = models.CharField(max_length=128)
    completed_at = models.DateTimeField()
    drawer = models.ForeignKey(
        Drawer,
        on_delete=models.CASCADE,
    )
    due_date = models.DateField()
    due_time = models.TimeField()
    priority = models.IntegerField()
    memo = models.TextField()
    reminder_datetime = models.DateTimeField()

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    repeat = models.ForeignKey(
        Repeat,
        on_delete=models.SET_NULL,
        null=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, default=None)