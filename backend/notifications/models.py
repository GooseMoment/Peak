from django.db import models

from api.models import Base
from tasks.models import Task
from users.models import User
from social.models import TaskReaction, Following
from peak_auth.models import AuthToken


class TaskReminder(Base):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="reminders")
    delta = models.IntegerField()
    scheduled = models.DateTimeField()

    def __str__(self) -> str:
        return (
            f"Reminder for {self.task.name} before {self.delta}min at {self.scheduled}"
        )

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- Base.Meta
        db_table = "task_reminders"


class Notification(Base):
    # https://docs.djangoproject.com/en/4.2/ref/models/fields/#choices

    FOR_TASK_REMINDER = "task_reminder"
    FOR_TASK_REACTION = "task_reaction"
    FOR_FOLLOW = "follow"
    FOR_FOLLOW_REQUEST = "follow_request"
    FOR_FOLLOW_REQUEST_ACCEPTED = "follow_request_accepted"

    NOTIFICATION_TYPES = [
        (FOR_TASK_REMINDER, "for task reminder"),
        (FOR_TASK_REACTION, "for task reaction"),
        (FOR_FOLLOW, "for follow"),
        (FOR_FOLLOW_REQUEST, "for follow request"),
        (FOR_FOLLOW_REQUEST_ACCEPTED, "for follow request accepted"),
    ]

    FOLLOWING_TYPES = (
        FOR_FOLLOW,
        FOR_FOLLOW_REQUEST,
        FOR_FOLLOW_REQUEST_ACCEPTED,
    )
    INTERACTION_TYPES = (FOR_TASK_REACTION,)
    SOCIAL_TYPES = INTERACTION_TYPES + FOLLOWING_TYPES

    type = models.CharField(choices=NOTIFICATION_TYPES, max_length=128)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    task_reminder = models.ForeignKey(
        TaskReminder,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    task_reaction = models.ForeignKey(
        TaskReaction,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    following = models.ForeignKey(
        Following,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    def __str__(self) -> str:
        return f"Notification: {self.task_reminder or self.task_reaction or self.following}"

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- Base.Meta
        db_table = "notifications"


class WebPushSubscription(Base):
    token = models.OneToOneField(
        AuthToken, on_delete=models.CASCADE, related_name="web_push_subscription"
    )
    locale = models.CharField(max_length=128, null=True, blank=True)
    fail_cnt = models.IntegerField(default=0)
    excluded_types = models.JSONField(default=list)

    # [PushSubscription](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)
    endpoint = models.URLField()
    auth = models.CharField(max_length=128)
    p256dh = models.CharField(max_length=128)
    expiration_time = models.FloatField(null=True, blank=True)

    def to_push_subscription(self):
        return {
            "keys": {"auth": self.auth, "p256dh": self.p256dh},
            "endpoint": self.endpoint,
            "expirationTime": self.expiration_time,
        }

    def __str__(self) -> str:
        return f"WebPushSubscription: <{self.token}>"

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- Base.Meta
        db_table = "web_push_subscriptions"
