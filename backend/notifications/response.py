from .models import Notification
from django.http import HttpRequest, HttpResponse
from django.core import serializers
import json


def __serialize_notifications(notifications):
    exclude_fields = ["_state"]

    filtered = []
    for notification in notifications.values():
        for exclude_field in exclude_fields:
            try:
                del notification[exclude_field]
            except KeyError:
                pass
        
        filtered.append(notification)
    
    return json.dumps(filtered, default=str)

def NotificationsJSONResponse(notifications):
    serialized = __serialize_notifications(notifications)
    return HttpResponse(serialized, content_type="application/json")