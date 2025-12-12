from rest_framework import serializers

from projects.models import Project
from drawers.models import Drawer
from tasks.models import Task

class ProjectSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        exclude = ()

class DrawerSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drawer
        exclude = ()

class TaskSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        exclude = ()

