from rest_framework import serializers

from .models import Task
from notifications.models import TaskReminder

from datetime import datetime

from api.serializers import DualityRelatedField
from drawers.serializers import DrawerSerializer
from users.serializers import UserSerializer


class TaskReminderSerializer(serializers.ModelSerializer):
    scheduled = serializers.DateTimeField(default=datetime.now(), required=False)
    task_name = serializers.SerializerMethodField()
    project_color = serializers.SerializerMethodField()
    project_id = serializers.SerializerMethodField()

    def get_task_name(self, obj):
        return obj.task.name

    def get_project_color(self, obj):
        return obj.task.drawer.project.color

    def get_project_id(self, obj):
        return obj.task.drawer.project.id

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = TaskReminder
        fields = [
            "id",
            "task",
            "delta",
            "scheduled",
            "task_name",
            "project_color",
            "project_id",
        ]


class TaskSerializer(serializers.ModelSerializer):
    user = UserSerializer(
        default=serializers.CurrentUserDefault(),
    )
    privacy = serializers.CharField(allow_null=True, required=False)
    reminders = TaskReminderSerializer(many=True, read_only=True)
    drawer = DualityRelatedField(DrawerSerializer)

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = Task
        fields = [
            "id",
            "name",
            "user",
            "drawer",
            "privacy",
            "priority",
            "order",
            "completed_at",
            "assigned_at",
            "due_type",
            "due_date",
            "due_datetime",
            "reminders",
            "memo",
            "created_at",
            "updated_at",
            "deleted_at",
        ]


class TaskGroupedSerializer(serializers.Serializer):
    id = serializers.UUIDField(source="drawer__project")
    name = serializers.CharField(source="drawer__project__name")
    color = serializers.CharField(source="drawer__project__color")
    count = serializers.IntegerField()
