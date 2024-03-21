from .models import Drawer
from rest_framework import serializers

from users.models import User

class DrawerSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(required=False, queryset=User.objects.all())
    order = serializers.IntegerField(min_value=0, required=False)
    uncompleted_task_count = serializers.IntegerField(read_only=True, default=0, required=False)
    completed_task_count = serializers.IntegerField(read_only=True, default=0, required=False)
    
    class Meta:
        model = Drawer
        fields = ['id', 'name', 'user', 'project', 'order', 'privacy', 'uncompleted_task_count', 'completed_task_count', 'created_at', 'updated_at', 'deleted_at']