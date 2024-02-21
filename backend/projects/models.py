from django.db import models

import uuid

from users.models import User

class Project(models.Model):
    REGULAR = "regular"
    GOAL = "goal"

    PROJECT_TYPE_CHOICES = [
        (REGULAR, "Regular"),
        (GOAL, "Goal"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=128)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    order = models.IntegerField()
    color = models.CharField(max_length=6)
    type = models.CharField(choices=PROJECT_TYPE_CHOICES, max_length=128)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField()
