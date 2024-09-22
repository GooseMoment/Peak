from .models import Task
from notifications.models import TaskReminder

from rest_framework import serializers
from users.models import User

from datetime import datetime

class TaskReminderSerializer(serializers.ModelSerializer):
    scheduled = serializers.DateTimeField(default=datetime.now(), required=False)
    task_name = serializers.SerializerMethodField(read_only=True)
    project_color = serializers.SerializerMethodField(read_only=True)
    project_id = serializers.SerializerMethodField(read_only=True)

    def get_task_name(self, obj):
        return obj.task.name
    
    def get_project_color(self, obj):
        return obj.task.drawer.project.color
    
    def get_project_id(self, obj):
        return obj.task.drawer.project.id
     
    class Meta:
        model = TaskReminder
        fields = ["id", "task", "delta", "scheduled", "task_name", "project_color", "project_id"]

class TaskSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(required=False, queryset=User.objects.all())
    drawer_name = serializers.SerializerMethodField(read_only=True)
    project_name = serializers.SerializerMethodField(read_only=True)
    project_id = serializers.SerializerMethodField(read_only=True)
    reminders = TaskReminderSerializer(many=True, read_only=True)
    due_datetime = serializers.SerializerMethodField(read_only=True)
    project_color = serializers.SerializerMethodField(read_only=True)

    def get_project_id(self, obj):
        return obj.drawer.project.id

    def get_drawer_name(self, obj):
        return obj.drawer.name

    def get_project_name(self, obj):
        return obj.drawer.project.name
    
    def get_due_datetime(self, obj):
        return obj.due_datetime()
    
    def get_project_color(self, obj):
        return obj.drawer.project.color
    
    class Meta:
        model = Task
        fields = [
            'id', 'name', 'privacy', 'completed_at', 'drawer', 'drawer_name', 'due_date', 'due_datetime', 'due_time', 'due_tz', 'assigned_at',
            'priority', 'memo', 'reminders', 'user', 'repeat', 'created_at', 'updated_at', 'deleted_at', 'project_name', 'project_id', 'project_color'
        ]

class TaskGroupedSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()
    color = serializers.CharField()
    count = serializers.IntegerField()
