from rest_framework import serializers

from . import exceptions
from .models import Notification, WebPushSubscription
from social.serializers import (
    TaskReactionSerializer,
    FollowingSerializer,
)
from tasks.serializers import TaskReminderSerializer


class NotificatonSerializer(serializers.ModelSerializer):
    username = serializers.PrimaryKeyRelatedField(
        read_only=True, source="user.username"
    )

    task_reminder = TaskReminderSerializer()
    task_reaction = TaskReactionSerializer()
    following = FollowingSerializer()

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = Notification
        depth = 1
        fields = [
            "id",
            "type",
            "username",
            "task_reminder",
            "task_reaction",
            "following",
            "created_at",
        ]


class CurrentTokenDefault:
    requires_context = True

    def __call__(self, serializer_field):
        return serializer_field.context["request"].auth

    def __repr__(self):
        return "%s()" % self.__class__.__name__


NOTIFICATION_TYPES = Notification.SOCIAL_TYPES + (Notification.FOR_TASK_REMINDER,)


class WebPushSubscriptionSerializer(serializers.ModelSerializer):
    token = serializers.HiddenField(default=CurrentTokenDefault())
    excluded_types = serializers.JSONField(default=list)

    def validate_excluded_types(self, value):
        if type(value) is not list or len(value) > len(NOTIFICATION_TYPES):
            raise exceptions.InvalidNotificationType

        # check all types are valid
        for t in value:
            if t not in NOTIFICATION_TYPES:
                raise exceptions.InvalidNotificationType

        # disallow excluding all types
        if len(value) == len(NOTIFICATION_TYPES):
            raise exceptions.AllTypesExcluded

        return value

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = WebPushSubscription
        fields = [
            "id",
            "token",
            "endpoint",
            "auth",
            "p256dh",
            "expiration_time",
            "locale",
            "excluded_types",
        ]
