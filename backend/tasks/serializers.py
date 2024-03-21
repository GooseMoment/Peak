from .models import Task

from rest_framework import serializers
from users.models import User

class TaskSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, required=False, queryset=User.objects.all())

    class Meta:
        model = Task
        fields = ['id', 'name', 'privacy', 'completed_at', 'drawer', 'due_date', 'due_time', 'priority', 'memo', 'reminder_datetime', 'user', 'repeat', 'created_at', 'updated_at', 'deleted_at']