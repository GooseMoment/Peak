from rest_framework import mixins, generics
from rest_framework.response import Response

from api.mixins import CreateMixin, TimezoneMixin
from api.permissions import IsUserOwner
from .models import Task
from .serializers import TaskSerializer
from notifications.models import TaskReminder
from notifications.serializers import TaskReminderSerializer
from notifications.utils import caculateScheduled
from drawers.utils import normalize_drawer_order

from datetime import datetime, time


class TaskDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    TimezoneMixin,
                    generics.GenericAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    lookup_field = "id"
    permission_classes = [IsUserOwner]

    def get(self, request, id, *args, **kwargs):
        instance = self.get_object()
        sorted_reminders = instance.reminders.order_by('delta')
        serializer = self.get_serializer(instance)
        data = serializer.data
        data['reminders'] = TaskReminderSerializer(sorted_reminders, many=True).data
        return Response(data)
    
    def patch(self, request, *args, **kwargs):
        try:
            new_due_type = request.data["due_type"]
            new_due_date = request.data["due_date"]
            new_due_datetime = request.data["due_datetime"]
        except KeyError:
            pass
        else:
            task: Task = self.get_object()
            prev_due_type = task.due_type
            prev_due_date = None
            prev_due_datetime = None

            if task.due_type == "due_date":
                prev_due_date = task.due_date.isoformat()
            elif task.due_type == "due_datetime":
                prev_due_datetime= task.due_datetime.isoformat()

            # new_due_date is None
            if (new_due_type is None) and (prev_due_type is not None):
                TaskReminder.objects.filter(task=task.id).delete()
            # new_due_date is true
            else:
                if (new_due_type is None):
                    pass
                elif (prev_due_date != new_due_date) or (prev_due_datetime != new_due_datetime):
                    if new_due_type == "due_date":
                        tz = self.get_tz()
                        converted_due_date = datetime.fromisoformat(new_due_date)
                        nine_oclock_time = time(hour=9, minute=0, second=0, tzinfo=tz)
                        converted_due_datetime = datetime.combine(converted_due_date, nine_oclock_time)
                    else:
                        converted_due_datetime = datetime.fromisoformat(new_due_datetime)
                    
                    reminders = TaskReminder.objects.filter(task=task.id)
                    for reminder in reminders:
                        reminder.scheduled = caculateScheduled(converted_due_datetime, reminder.delta)
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

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user).order_by("order").all()
        drawer_id = self.request.query_params.get("drawer", None)
        if drawer_id is not None:
            queryset = queryset.filter(drawer__id=drawer_id)

        ordering_fields = ['name', 'assigned_at', 'due_date', 'due_datetime', 'priority', 'created_at', 'reminders']
        ordering = self.request.GET.get("ordering", None)

        if ordering.lstrip('-') in ordering_fields:
            normalize_drawer_order(queryset, ordering)

        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create_with_user(request, *args, **kwargs)
