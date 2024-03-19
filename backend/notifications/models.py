from django.db import models

from api.models import Base
from tasks.models import Task
from users.models import User
from social.models import Reaction, Following

class TaskReminder(Base):
    task = models.ForeignKey(
        Task,
        on_delete = models.CASCADE,
    )
    scheduled = models.DateTimeField()

    def __str__(self) -> str:
        return f"Reminder for {self.task.name} at {self.scheduled}"

class Notification(Base):
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

    type = models.CharField(choices=NOTIFICATION_TYPES, max_length=128)
    user = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
        null=True,
        blank=True,
    )
    task = models.ForeignKey(
        Task,
        on_delete = models.CASCADE,
        null=True,
        blank=True,
    )
    reaction = models.ForeignKey(
        Reaction,
        on_delete = models.CASCADE,
        null=True,
        blank=True,
    )
    follow_request = models.ForeignKey(
        Following,
        on_delete = models.CASCADE,
        null=True,
        blank=True,
    )

    def __str__(self) -> str:
        return f"{self.type} for {self.user}"