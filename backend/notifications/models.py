from django.db import models

from api.models import Base
from tasks.models import Task
from users.models import User
from social.models import Reaction, Following, Peck

class TaskReminder(Base):
    task = models.ForeignKey(
        Task,
        on_delete = models.CASCADE,
        related_name = 'reminders'
    )
    scheduled = models.DateTimeField()

    def __str__(self) -> str:
        return f"Reminder for {self.task.name} at {self.scheduled}"

class Notification(Base):
    # https://docs.djangoproject.com/en/4.2/ref/models/fields/#choices

    FOR_TASK_REMINDER = "task_reminder"
    FOR_REACTION = "reaction"
    FOR_FOLLOW = "follow"
    FOR_FOLLOW_REQUEST = "follow_request"
    FOR_FOLLOW_REQUEST_ACCEPTED = "follow_request_accepted"
    FOR_PECK = "peck"
    FOR_TRENDING_UP = "trending_up"
    FOR_TRENDING_DOWN = "trending_down"

    NOTIFICATION_TYPES = [
        (FOR_TASK_REMINDER, "for task reminder"),
        (FOR_REACTION, "for reaction"),
        (FOR_FOLLOW, "for follow"),
        (FOR_FOLLOW_REQUEST, "for follow request"),
        (FOR_FOLLOW_REQUEST_ACCEPTED, "for follow request accpeted"),
        (FOR_PECK, "for peck"),
        (FOR_TRENDING_UP, "for trending up"),
        (FOR_TRENDING_DOWN, "for trending down"),
    ]

    FOLLOWING_TYPES = (FOR_FOLLOW, FOR_FOLLOW_REQUEST, FOR_FOLLOW_REQUEST_ACCEPTED, )
    SOCIAL_TYPES = (FOR_REACTION, FOR_PECK, ) + FOLLOWING_TYPES

    type = models.CharField(choices=NOTIFICATION_TYPES, max_length=128)
    user = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
        null=True,
        blank=True,
    )
    task_reminder = models.ForeignKey(
        TaskReminder,
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
    following = models.ForeignKey(
        Following,
        on_delete = models.CASCADE,
        null=True,
        blank=True,
    )
    peck = models.ForeignKey(
        Peck,
        on_delete = models.CASCADE,
        null=True,
        blank=True,
    )

    def __str__(self) -> str:
        return f"{self.type} for {self.user}"

class WebPushSubscription(Base):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    subscription_info = models.JSONField()
    browser = models.CharField(max_length=128)
    user_agent = models.CharField(max_length=500, blank=True)
