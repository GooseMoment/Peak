from rest_framework import mixins, generics, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from api.mixins import TimezoneMixin
from tasks.serializers import TaskSerializer, TaskGroupedSerializer
from tasks.models import Task

import datetime
from django.db.models import Count


class TaskTodayAssignedList(
    TimezoneMixin, mixins.ListModelMixin, generics.GenericAPIView
):
    serializer_class = TaskSerializer

    def get_queryset(self):
        try:
            date_isoformat = self.request.GET.get("date", "")  # e.g. "2024-09-29"
            date = datetime.date.fromisoformat(date_isoformat)
        except ValueError:
            date = self.get_today()

        today_assignment_tasks = (
            Task.objects.filter(
                user=self.request.user, assigned_at=date, completed_at__isnull=True
            )
            .order_by("-priority", "due_date", "created_at")
            .all()
        )

        return today_assignment_tasks

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class ImportantTaskListPagination(PageNumberPagination):
    page_size = 4


class TodayDueTaskList(mixins.ListModelMixin, TimezoneMixin, generics.GenericAPIView):
    serializer_class = TaskSerializer
    pagination_class = ImportantTaskListPagination

    def get_queryset(self):
        today = self.get_today()
        return (
            Task.objects.filter(
                user=self.request.user,
                due_date=today,
                completed_at__isnull=True,
            )
            .exclude(assigned_at=today)
            .order_by("due_date")
        )

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class OverDueTaskList(mixins.ListModelMixin, TimezoneMixin, generics.GenericAPIView):
    serializer_class = TaskSerializer
    pagination_class = ImportantTaskListPagination

    def get_queryset(self):
        now = self.get_now()
        today = self.get_today()
        return Task.objects.filter(
            user=self.request.user,
            due_date__lt=today,
            due_datetime__lt=now,
            completed_at__isnull=True,
        ).order_by("due_date")

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class PastAssignedTaskList(
    mixins.ListModelMixin, TimezoneMixin, generics.GenericAPIView
):
    serializer_class = TaskSerializer
    pagination_class = ImportantTaskListPagination

    def get_queryset(self):
        today = self.get_today()
        return (
            Task.objects.filter(
                user=self.request.user,
                assigned_at__lt=today,
                completed_at__isnull=True,
            )
            .exclude(assigned_at=today)
            .order_by("assigned_at")
        )

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class TaskTodayAssignedGrouped(TimezoneMixin, generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        today = self.get_today()

        grouped = (
            Task.objects.filter(
                assigned_at=today,
                completed_at__isnull=True,
                user=request.user,
            )
            .values(
                "drawer__project",
                "drawer__project__color",
                "drawer__project__name",
            )
            .annotate(
                count=Count("drawer__project"),
            )
            .order_by()
        )

        s = TaskGroupedSerializer(data=grouped, many=True)
        s.is_valid()

        return Response(s.data, status=status.HTTP_200_OK)
