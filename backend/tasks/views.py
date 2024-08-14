from rest_framework import mixins, generics
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from rest_framework.pagination import PageNumberPagination

from api.views import CreateMixin
from api.permissions import IsUserMatch
from datetime import datetime
from django.utils import timezone
from django.db.models import Q
from .models import Task
from .serializers import TaskSerializer
from notifications.models import TaskReminder
from notifications.serializers import TaskReminderSerializer
from notifications.utils import caculateScheduled
from .utils import combine_due_datetime

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
        ).order_by("created_at").all()

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
        ).order_by("created_at").all()

        return today_tasks
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
