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
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField()
    user = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
    )
    task = models.ForeignKey(
        Task,
        on_delete = models.CASCADE,
    )
    reaction = models.ForeignKey(
        Reaction,
        on_delete = models.CASCADE,
    )
    follow_request = models.ForeignKey(
        Following,
        on_delete = models.CASCADE,
    )
    
    notified_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField()