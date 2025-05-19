from rest_framework import serializers

from .models import Task
from notifications.models import TaskReminder
from users.models import User

from datetime import datetime


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

    class Meta:
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
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=serializers.CurrentUserDefault()
    )
    drawer_name = serializers.SerializerMethodField()
    project_name = serializers.SerializerMethodField()
    project_id = serializers.SerializerMethodField()
    reminders = TaskReminderSerializer(many=True, read_only=True)
    project_color = serializers.SerializerMethodField()

    def get_project_id(self, obj):
        return obj.drawer.project.id

    def get_drawer_name(self, obj):
        return obj.drawer.name

    def get_project_name(self, obj):
        return obj.drawer.project.name

    def get_project_color(self, obj):
        return obj.drawer.project.color

    class Meta:
        model = Task
        fields = [
            "id",
            "name",
            "privacy",
            "completed_at",
            "drawer",
            "drawer_name",
            "due_type",
            "due_date",
            "due_datetime",
            "assigned_at",
            "priority",
            "memo",
            "reminders",
            "user",
            "order",
            "created_at",
            "updated_at",
            "deleted_at",
            "project_name",
            "project_id",
            "project_color",
        ]


class TaskGroupedSerializer(serializers.Serializer):
    id = serializers.UUIDField(source="drawer__project")
    name = serializers.CharField(source="drawer__project__name")
    color = serializers.CharField(source="drawer__project__color")
    count = serializers.IntegerField()


class TaskReorderSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    order = serializers.IntegerField(min_value=0)
