from rest_framework import serializers

from .models import Drawer
from users.models import User

from projects.serializers import ProjectSerializer
from api.serializers import DualityRelatedField


class DrawerSerializer(serializers.ModelSerializer):
    user_username = serializers.PrimaryKeyRelatedField(
        source="user.username",
        queryset=User.objects.all(),
        default=serializers.CurrentUserDefault(),
    )
    project = DualityRelatedField(ProjectSerializer)
    uncompleted_task_count = serializers.IntegerField(default=0, read_only=True)
    completed_task_count = serializers.IntegerField(default=0, read_only=True)

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = Drawer
        fields = [
            "id",
            "name",
            "user_username",
            "project",
            "privacy",
            "order",
            "uncompleted_task_count",
            "completed_task_count",
            "created_at",
            "updated_at",
            "deleted_at",
        ]


class DrawerReorderSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    order = serializers.IntegerField(min_value=0)
