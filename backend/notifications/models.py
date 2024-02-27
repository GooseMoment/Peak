from django.db import models

import uuid

from tasks.models import Task
from users.models import User
from social.models import Reaction, Following

class TaskReminder(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    task = models.ForeignKey(
        Task,
        on_delete = models.CASCADE,
    )
    scheduled = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField()

class Notification(models.Model):
    # https://docs.djangoproject.com/en/4.2/ref/models/fields/#choices

    FOR_TASK = "task"
    FOR_REACTION = "reaction"
    FOR_FOLLOW = "follow"
    FOR_FOLLOW_REQUEST = "follow_request"
    FOR_FOLLOW_REQUEST_ACCEPTED = "follow_request_accepted"
    FOR_PECKED = "pecked"
    FOR_TRENDING_UP = "trending_up"
    FOR_TRENDING_DOWN = "trending_down"

    NOTIFICATION_TYPES = [
        (FOR_TASK, "for task"),
        (FOR_REACTION, "for reaction"),
        (FOR_FOLLOW, "for follow"),
        (FOR_FOLLOW_REQUEST, "for follow request"),
        (FOR_FOLLOW_REQUEST_ACCEPTED, "for follow request accpeted"),
        (FOR_PECKED, "for pecked"),
        (FOR_TRENDING_UP, "for trending up"),
        (FOR_TRENDING_DOWN, "for trending down"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(choices=NOTIFICATION_TYPES)
    user = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
        null=True,
    )
    task = models.ForeignKey(
        Task,
        on_delete = models.CASCADE,
        null=True,
    )
    reaction = models.ForeignKey(
        Reaction,
        on_delete = models.CASCADE,
        null=True,
    )
    follow_request = models.ForeignKey(
        Following,
        on_delete = models.CASCADE,
        null=True,
    )
    
    notified_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField()