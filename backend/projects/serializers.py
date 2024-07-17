from .models import Project
from rest_framework import serializers

from drawers.serializers import DrawerSerializer
from users.models import User

class ProjectSerializer(serializers.ModelSerializer):
    drawers = DrawerSerializer(many=True, read_only=True)
    user = serializers.PrimaryKeyRelatedField(required=False, queryset=User.objects.all())
    order = serializers.IntegerField(min_value=0, required=False)
    completed_task_count = serializers.SerializerMethodField(read_only=True)
    uncompleted_task_count = serializers.SerializerMethodField(read_only=True)

    def get_completed_task_count(self, obj):
        completed_task_count = 0

        for drawer in obj.drawers.all():
            completed_task_count += drawer.completed_task_count

        return completed_task_count
    
    def get_uncompleted_task_count(self, obj):
        uncompleted_task_count = 0

        for drawer in obj.drawers.all():
            uncompleted_task_count += drawer.uncompleted_task_count

        return uncompleted_task_count
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'user', 'order', 'color', 'type', 'created_at', 'updated_at', 'deleted_at', 'completed_task_count', 'uncompleted_task_count', 'drawers']

class ProjectSerializerForUserProjectList(serializers.ModelSerializer):
    class Meta:
        model = Project
        exclude = ()
