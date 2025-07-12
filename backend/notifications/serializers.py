from .models import Notification, WebPushSubscription
from rest_framework import serializers

from social.serializers import (
    CommentSerializer,
    ReactionSerializer,
    FollowingSerializer,
    PeckSerializer,
)
from tasks.serializers import TaskReminderSerializer


class NotificatonSerializer(serializers.ModelSerializer):
    username = serializers.PrimaryKeyRelatedField(
        read_only=True, source="user.username"
    )

    task_reminder = TaskReminderSerializer()
    comment = CommentSerializer()
    reaction = ReactionSerializer()
    following = FollowingSerializer()
    peck = PeckSerializer()

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = Notification
        depth = 1
        fields = [
            "id",
            "type",
            "username",
            "task_reminder",
            "comment",
            "reaction",
            "following",
            "peck",
            "created_at",
        ]


class CurrentTokenDefault:
    requires_context = True

    def __call__(self, serializer_field):
        return serializer_field.context["request"].auth

    def __repr__(self):
        return "%s()" % self.__class__.__name__


class WebPushSubscriptionSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    token = serializers.HiddenField(default=CurrentTokenDefault())

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = WebPushSubscription
        fields = [
            "id",
            "user",
            "token",
            "endpoint",
            "auth",
            "p256dh",
            "expiration_time",
            "locale",
            "excluded_types",
        ]
