from .models import Drawer

from rest_framework import serializers

class DrawerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drawer
        fields = ['id', 'name', 'user', 'project', 'order', 'privacy', 'uncompleted_task_count', 'completed_task_count', 'created_at', 'updated_at', 'deleted_at']