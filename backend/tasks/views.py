from typing import Any
from rest_framework import mixins, generics, status
from rest_framework.response import Response

from datetime import datetime

from api.mixins import CreateMixin
from api.permissions import IsUserMatch
from .models import Task
from .serializers import TaskSerializer
from notifications.models import TaskReminder
from notifications.serializers import TaskReminderSerializer
from notifications.utils import caculateScheduled
from .utils import combine_due_datetime
from drawers.utils import normalize_drawer_order

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
        except KeyError:
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
        except KeyError:
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

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user).order_by("order").all()
        drawer_id = self.request.query_params.get("drawer", None)
        if drawer_id is not None:
            queryset = queryset.filter(drawer__id=drawer_id)

        ordering_fields = ['name', 'assigned_at', 'due_date', 'due_time', 'priority', 'created_at', 'reminders']
        ordering = self.request.GET.get("ordering", None)

        if ordering.lstrip('-') in ordering_fields:
            normalize_drawer_order(queryset, ordering)

        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create_with_user(request, *args, **kwargs)
