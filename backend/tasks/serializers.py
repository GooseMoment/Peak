from .models import Task

from rest_framework import serializers
from users.models import User

class TaskSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(required=False, queryset=User.objects.all())
    drawer_name = serializers.SerializerMethodField(read_only=True)
    project_name = serializers.SerializerMethodField(read_only=True)
    project_id = serializers.SerializerMethodField(read_only=True)

    def get_project_id(self, obj):
        return obj.drawer.project.id

    def get_drawer_name(self, obj):
        return obj.drawer.name

    def get_project_name(self, obj):
        return obj.drawer.project.name
    
    class Meta:
        model = Task
        fields = [
            'id', 'name', 'privacy', 'completed_at', 'drawer', 'drawer_name', 'due_date', 'due_time', 'priority', 
            'memo', 'reminders', 'user', 'repeat', 'created_at', 'updated_at', 'deleted_at', 'project_name', 'project_id',
        ]
