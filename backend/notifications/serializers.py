from .models import TaskReminder, Notification
from rest_framework import serializers

from tasks.serializers import TaskSerializer
from social.serializers import ReactionSerializer, FollowingSerializer, PeckSerializer

class TaskReminderSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)
     
    class Meta:
        model = TaskReminder
        fields = ["task", "scheduled"]

class NotificatonSerializer(serializers.ModelSerializer):
    username = serializers.PrimaryKeyRelatedField(read_only=True, source="user.username")

    task_reminder = TaskReminderSerializer()
    reaction = ReactionSerializer()
    following = FollowingSerializer()
    peck = PeckSerializer()

    class Meta:
        model = Notification
        depth = 1
        fields = [
            "id", "type", "username", "task_reminder", "reaction", "following", "peck", "created_at",
        ]
