from rest_framework import serializers

from tasks.serializers import TaskSerializer
from projects.serializers import ProjectSerializer

class SearchResultsSerializer(TaskSerializer):
    color = serializers.CharField(read_only=True)

    class Meta(TaskSerializer.Meta):
        fields = TaskSerializer.Meta.fields + ['color']