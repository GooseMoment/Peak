from rest_framework import mixins, generics, permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.pagination import CursorPagination
from rest_framework.permissions import BasePermission

from django.shortcuts import get_object_or_404

import uuid
from datetime import datetime, time

from api.mixins import TimezoneMixin
from api.permissions import IsUserOwner
from tasks.models import Task
from .models import Notification, WebPushSubscription, TaskReminder
from .serializers import (
    NotificatonSerializer,
    WebPushSubscriptionSerializer,
    TaskReminderSerializer,
)
from .utils import caculateScheduled

from api.exceptions import RequiredFieldMissing


class IsUserMatchInReminder(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return obj.task.user == request.user


class ReminderDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
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

    def post(self, request: Request, *args, **kwargs):
        try:
            task_id = request.data["task"]
            delta_list = request.data["delta_list"]
            uuid_task_id = uuid.UUID(hex=task_id)
        except (KeyError, ValueError, TypeError):
            raise RequiredFieldMissing

        task = get_object_or_404(Task, id=uuid_task_id)

        if task.reminders.exists():
            task.reminders.all().delete()

        if len(delta_list) == 0:
            return Response(status=status.HTTP_204_NO_CONTENT)

        match task.due_type:
            case Task.DUE_DATE:
                assert task.due_date is not None
                tz = self.get_tz()
                nine_oclock_time = time(hour=9, minute=0, second=0, tzinfo=tz)
                converted_due_datetime = datetime.combine(
                    date=task.due_date, time=nine_oclock_time
                )
            case Task.DUE_DATETIME:
                assert task.due_datetime is not None
                converted_due_datetime = task.due_datetime
            case _:
                raise RequiredFieldMissing

        for delta in delta_list:
            new_scheduled = caculateScheduled(converted_due_datetime, delta)
            TaskReminder.objects.create(task=task, delta=delta, scheduled=new_scheduled)

        return Response(status=status.HTTP_200_OK)


class NotificationListPagination(CursorPagination):
    page_size = 20
    ordering = "-created_at"


class NotificationList(generics.ListAPIView):
    serializer_class = NotificatonSerializer
    pagination_class = NotificationListPagination
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        types = self.request.query_params.get("types", "").split("|")

        return (
            Notification.objects.filter(user=self.request.user)
            .order_by("-created_at")
            .filter(type__in=types)
            .all()
        )


class NotificationDetail(generics.RetrieveDestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificatonSerializer
    lookup_field = "id"
    permission_classes = [IsUserOwner]


class WebPushSubscriptionCreate(generics.CreateAPIView):
    queryset = WebPushSubscription.objects.all()
    serializer_class = WebPushSubscriptionSerializer


class WebPushSubscriptionPermission(BasePermission):
    def has_object_permission(
        self, request: Request, view, obj: WebPushSubscription
    ) -> bool:
        return request.auth == obj.token


class WebPushSubscriptionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = WebPushSubscription.objects.all()
    serializer_class = WebPushSubscriptionSerializer
    lookup_field = "id"
    permission_classes = (WebPushSubscriptionPermission,)
