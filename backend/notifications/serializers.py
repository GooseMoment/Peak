from .models import Notification
from rest_framework import serializers

class NotificatonSerializer(serializers.ModelSerializer):
    # TODO: add nested relationships
    # https://www.django-rest-framework.org/api-guide/relations/#example
    # user = 
    # task = 
    # reaction = 
    # follow_request = 

    class Meta:
        model = Notification
        fields = ["id", "type", "user", "task", "reaction", "follow_request"]
