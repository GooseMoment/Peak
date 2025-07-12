from rest_framework import mixins, generics, permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.pagination import CursorPagination

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
from . import exceptions

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


class NotificationList(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
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

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class NotificationDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
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


class WebPushSubscriptionDetail(
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    queryset = WebPushSubscription.objects.all()
    serializer_class = WebPushSubscriptionSerializer
    lookup_field = "id"
    permission_classes = [IsUserOwner]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    # Only accepts updating excluded_types for now
    def patch(self, request: Request, *args, **kwargs):
        try:
            excluded_types: list[str] = request.data["excluded_types"]
        except KeyError:
            raise exceptions.ExcludedTypesMissing

        notification_types = Notification.SOCIAL_TYPES + (
            Notification.FOR_TASK_REMINDER,
        )

        if type(excluded_types) is not list or len(excluded_types) > len(
            notification_types
        ):
            raise exceptions.InvalidNotificationType

        # check all types are valid
        for t in excluded_types:
            if t not in notification_types:
                raise exceptions.InvalidNotificationType

        # disallow excluding all types
        if len(excluded_types) == len(notification_types):
            raise exceptions.AllTypesExcluded

        subscription: WebPushSubscription = self.get_object()
        serializer = WebPushSubscriptionSerializer(
            subscription, data={"excluded_types": excluded_types}, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
