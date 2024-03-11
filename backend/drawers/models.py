from django.db import models

import uuid

from projects.models import Project
from users.models import User

class Drawer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=128)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="drawers",
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="drawers",
    )
    order = models.IntegerField()
    privacy = models.CharField(max_length=128)
    uncompleted_task_count = models.IntegerField()
    completed_task_count = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, default=None)