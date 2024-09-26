from typing import Any
from rest_framework import mixins, generics, status
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from rest_framework.pagination import PageNumberPagination

from django.utils import timezone
from django.db.models import Q, F, Count, ExpressionWrapper, DateTimeField

from datetime import datetime, time, UTC
from pytz import timezone as get_timezone, UnknownTimeZoneError

from .models import Task
from .serializers import TaskSerializer, TaskGroupedSerializer
from .utils import combine_due_datetime
from api.views import CreateMixin
from api.permissions import IsUserMatch
from notifications.models import TaskReminder
from notifications.serializers import TaskReminderSerializer
from notifications.utils import caculateScheduled

class TaskDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    lookup_field = "id"
    permission_classes = [IsUserMatch]

    def get(self, request, id, *args, **kwargs):
        instance = self.get_object()
        sorted_reminders = instance.reminders.order_by('delta')
        serializer = self.get_serializer(instance)
        data = serializer.data
        data['reminders'] = TaskReminderSerializer(sorted_reminders, many=True).data
        return Response(data)
    
    def patch(self, request, *args, **kwargs):
        try:
            due_tz = request.data["due_tz"]
            new_due_date = request.data["due_date"]
            new_due_time = request.data["due_time"]
        except KeyError as e:
            pass
        else:
            task: Task = self.get_object()
            prev_due_date = None
            prev_due_time = None

            if task.due_date is not None:
                prev_due_date = task.due_date.strftime("%Y-%m-%d")

            if task.due_time is not None:
                prev_due_time = task.due_time.strftime("%H:%M:%S")

            # new_due_date is None
            if (new_due_date is None) and (prev_due_date is not None):
                TaskReminder.objects.filter(task=task.id).delete()
            # new_due_date is true
            else:   
                if (prev_due_date != new_due_date) or (prev_due_time != new_due_time):
                    converted_due_date = datetime.strptime(new_due_date, "%Y-%m-%d").date()
                    # new_due_time is None -> 9시 설정
                    if new_due_time is None:
                        converted_due_time = datetime.strptime("09:00:00", "%H:%M:%S").time()
                    # new_due_time is true -> new_due_time 대로 설정
                    else:
                        converted_due_time = datetime.strptime(new_due_time, "%H:%M:%S").time()
                    
                    reminders = TaskReminder.objects.filter(task=task.id)
                    for reminder in reminders:
                        reminder.scheduled = caculateScheduled(combine_due_datetime(due_tz, converted_due_date, converted_due_time), reminder.delta)
                        reminder.save()
    
        try:
            new_completed = request.data["completed_at"]
        except KeyError as e:
            pass
        else:
            task: Task = self.get_object()
            if (task.completed_at is None) or (new_completed is None):
                if new_completed is None:
                    task.drawer.uncompleted_task_count += 1
                    task.drawer.completed_task_count -= 1
                else:
                    task.drawer.uncompleted_task_count -= 1
                    task.drawer.completed_task_count += 1

            task.drawer.save()

        return self.partial_update(request, *args, **kwargs)
    
    def delete(self, request, id, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
    
class TaskList(CreateMixin,
                  mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  generics.GenericAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsUserMatch]
    filter_backends = [OrderingFilter]
    ordering_fields = ['name', 'assigned_at', 'due_date', 'due_time', 'priority', 'created_at', 'reminders']
    ordering = ['created_at']

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user).order_by("created_at").all()
        drawer_id = self.request.query_params.get("drawer", None)
        if drawer_id is not None:
            queryset = queryset.filter(drawer__id=drawer_id)
        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create_with_user(request, *args, **kwargs)

class OverdueTaskListPagination(PageNumberPagination):
    page_size = 4

class OverdueTaskList(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsUserMatch]
    pagination_class = OverdueTaskListPagination

    def get_queryset(self):
        filter_field = self.request.GET.get('filter_field', 'due_date')

        now = timezone.now()
        if filter_field == 'assigned_at':
            filter_condition = {'assigned_at__lt': now}
        if filter_field == 'due_date':
            filter_condition = {'due_date__lt': now}

        overdue_tasks = Task.objects.filter(
            user=self.request.user,
            **filter_condition,
            completed_at__isnull=True
        ).order_by(filter_field).all()

        return overdue_tasks
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class TodayTaskList(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsUserMatch]

    def get_queryset(self):
        now = timezone.now()
        today_start = timezone.datetime.combine(now.date(), timezone.datetime.min.time(), tzinfo=timezone.get_current_timezone())
        today_end = timezone.datetime.combine(now.date(), timezone.datetime.max.time(), tzinfo=timezone.get_current_timezone())

        today_tasks = Task.objects.filter(
            Q(user=self.request.user),
            Q(due_date__gte=today_start, due_date__lte=today_end) |
            Q(assigned_at__gte=today_start, assigned_at__lte=today_end),
            Q(completed_at__isnull=True)
        ).order_by("assigned_at", "due_date").all()

        return today_tasks
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    

class TimezoneView(generics.GenericAPIView):
    def __init__(self, **kwargs):
        self._tz = None
        self._now = None
        self._today = None
        self._today_range = None

        super().__init__(**kwargs)

    def get_tz(self):
        if self._tz is not None:
            return self._tz

        tz = self.request.GET.get("tz", "UTC") 

        try:
            tz = get_timezone(tz)
        except UnknownTimeZoneError:
            tz = UTC
        
        self._tz = tz
        return tz

    def get_now(self):
        if self._now is not None:
            return self._now

        tz = self.get_tz()
        now = datetime.now(tz)

        self._now = now
        return now

    def get_today(self):
        if self._today is not None:
            return self._today

        now = self.get_now()
        today = now.date()

        self._today = today
        return today
    
    def get_today_range(self):
        if self._today_range is not None:
            return self._today_range

        today = self.get_today()
        tz = self.get_tz()
        today_min = datetime.combine(today, time.min, tzinfo=tz)
        today_max = datetime.combine(today, time.max, tzinfo=tz)

        today_range = (today_min, today_max)
        self._today_range = today_range

        return today_range


class TaskAssignedTodayGrouped(TimezoneView):
    def get(self, request, *args, **kwargs):
        today = self.get_today()

        grouped = Task.objects.filter(
            assigned_at=today,
            completed_at__isnull=True,
            user=request.user,
        ).values(
            "drawer__project", "drawer__project__color", "drawer__project__name",
        ).annotate(
            count=Count("drawer__project"),
        ).order_by()

        s = TaskGroupedSerializer(data=grouped, many=True)
        s.is_valid()

        return Response(s.data, status=status.HTTP_200_OK)

