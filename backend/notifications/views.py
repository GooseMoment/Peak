from rest_framework import mixins, generics, permissions
from rest_framework.pagination import CursorPagination

from .models import Notification, WebPushSubscription
from .serializers import NotificatonSerializer, WebPushSubscriptionSerializer
from api.permissions import IsUserMatch

class NotificationListPagination(CursorPagination):
    page_size = 20
    ordering = "-created_at"

class NotificationList(mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  generics.GenericAPIView):
    serializer_class = NotificatonSerializer
    pagination_class = NotificationListPagination
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        types = self.request.query_params.get("types", "").split("|")       

        return Notification.objects.filter(user=self.request.user).order_by("-created_at").filter(type__in=types).all()

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

class WebPushSubscriptionCreate(mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = WebPushSubscription.objects.all()
    serializer_class = WebPushSubscriptionSerializer

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class WebPushSubscriptionDelete(mixins.DestroyModelMixin, generics.GenericAPIView):
    queryset = WebPushSubscription.objects.all()
    serializer_class = WebPushSubscriptionSerializer
    lookup_field = "id"
    permission_classes = [IsUserMatch]

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
