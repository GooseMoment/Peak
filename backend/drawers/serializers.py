from rest_framework import serializers

from .models import Drawer
from users.models import User


class DrawerSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=serializers.CurrentUserDefault()
    )
    order = serializers.IntegerField(min_value=0, default=0)
    uncompleted_task_count = serializers.IntegerField(default=0, read_only=True)
    completed_task_count = serializers.IntegerField(default=0, read_only=True)

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = Drawer
        fields = [
            "id",
            "name",
            "user",
            "project",
            "order",
            "privacy",
            "uncompleted_task_count",
            "completed_task_count",
            "created_at",
            "updated_at",
            "deleted_at",
        ]
