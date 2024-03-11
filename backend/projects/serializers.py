from .models import Project
from rest_framework import serializers

from drawers.serializers import DrawerSerializer

class ProjectSerializer(serializers.ModelSerializer):
    drawers = DrawerSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'user', 'order', 'color', 'type', 'created_at', 'updated_at', 'deleted_at', 'drawers']