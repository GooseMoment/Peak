from rest_framework import mixins, generics, status
from rest_framework.response import Response

from .models import Task
from .serializers import TaskSerializer
from notifications.serializers import TaskReminderSerializer
from api.permissions import IsUserMatch
from api.views import CreateMixin

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
            new_completed = request.data["completed_at"]
        except KeyError as e:
            print(e)
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
        queryset = Task.objects.filter(user=self.request.user).order_by("created_at").all()
        drawer_id = self.request.query_params.get("drawer", None)
        if drawer_id is not None:
            queryset = queryset.filter(drawer__id=drawer_id)
        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create_with_user(request, *args, **kwargs)