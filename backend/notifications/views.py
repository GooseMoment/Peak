from rest_framework import mixins, generics, permissions, status
from rest_framework.response import Response
from rest_framework.pagination import CursorPagination

from api.mixins import TimezoneMixin
from .models import Notification, WebPushSubscription, TaskReminder
from tasks.models import Task
from .serializers import NotificatonSerializer, WebPushSubscriptionSerializer, TaskReminderSerializer
from api.permissions import IsUserOwner
from .utils import caculateScheduled

from zoneinfo import ZoneInfo
from datetime import datetime, time

class IsUserMatchInReminder(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return obj.task.user == request.user

class ReminderDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    queryset = TaskReminder.objects.all()
    serializer_class = TaskReminderSerializer
    permission_classes = [IsUserMatchInReminder]
    lookup_field = "id"

    def get(self, request, id, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, id, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
    
class ReminderList(mixins.CreateModelMixin, TimezoneMixin, generics.GenericAPIView):
    queryset = TaskReminder.objects.all()
    serializer_class = TaskReminderSerializer

    def post(self, request, *args, **kwargs):
        serializer = TaskReminderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = serializer.validated_data["task"]
        task = Task.objects.get(id=task.id)

        if task.due_type == "due_date":
            tz = self.get_tz()
            nine_oclock_time = time(hour=9, minute=0, second=0, tzinfo=ZoneInfo(str(tz)))
            converted_due_datetime = datetime.combine(date=task.due_date, time=nine_oclock_time)
        else:
            converted_due_datetime = task.due_datetime
            
        new_scheduled = caculateScheduled(converted_due_datetime, serializer.validated_data["delta"])    
        serializer.validated_data["scheduled"] = new_scheduled
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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
    permission_classes = [IsUserOwner]
    
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
    permission_classes = [IsUserOwner]

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
