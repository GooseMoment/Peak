from rest_framework import serializers

from .models import Project
from users.models import User


class ProjectSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        source="user",
        queryset=User.objects.all(),
        default=serializers.CurrentUserDefault(),
    )
    completed_task_count = serializers.SerializerMethodField()
    uncompleted_task_count = serializers.SerializerMethodField()

    def get_completed_task_count(self, obj: Project):
        completed_task_count = 0

        for drawer in obj.drawers.all():
            completed_task_count += drawer.completed_task_count

        return completed_task_count

    def get_uncompleted_task_count(self, obj: Project):
        uncompleted_task_count = 0

        for drawer in obj.drawers.all():
            uncompleted_task_count += drawer.uncompleted_task_count

        return uncompleted_task_count

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = Project
        fields = [
            "id",
            "name",
            "user_id",
            "order",
            "privacy",
            "color",
            "type",
            "completed_task_count",
            "uncompleted_task_count",
            "created_at",
            "updated_at",
            "deleted_at",
        ]


class ProjectSerializerForUserProjectList(serializers.ModelSerializer):
    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = Project
        exclude = ()
