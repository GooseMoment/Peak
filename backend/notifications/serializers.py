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
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    task_reminder = TaskReminderSerializer()
    reaction = ReactionSerializer()
    following = FollowingSerializer()
    peck = PeckSerializer()

    class Meta:
        model = Notification
        depth = 1
        fields = ["id", "type", "user", "task_reminder", "reaction", "following", "peck"]
