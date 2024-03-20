from rest_framework import mixins, generics, permissions

from .models import Notification
from .serializers import NotificatonSerializer
from .permissions import IsUserMatch

class NotificationList(mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  generics.GenericAPIView):
    serializer_class = NotificatonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by("notified_at").all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class NotificationDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificatonSerializer
    lookup_field = "id"
    permission_classes = [IsUserMatch]
    
    def get(self, request, id, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, id, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)