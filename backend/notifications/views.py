from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status, mixins, generics
from rest_framework.decorators import api_view

from .models import Notification
from .serializers import NotificatonSerializer

@api_view(["GET"])
def get_notifications(request: Request, format=None):
    if not request.user.is_authenticated:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    notifications = Notification.objects.filter(user=request.user)
    serializer = NotificatonSerializer(notifications, many=True)
    return Response(serializer.data)

@method_decorator(login_required, name="dispatch")
class NotificationDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificatonSerializer
    lookup_field = "id"
    
    def get(self, request, id, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, id, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)