from .models import Notification
from rest_framework import serializers

class NotificatonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "type", "user", "task", "reaction", "follow_request"]
