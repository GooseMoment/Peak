from rest_framework import mixins, generics
from rest_framework.pagination import PageNumberPagination

from .models import Task
from .serializers import TaskSerializer
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
        return self.retrieve(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        try:
            task: Task = self.get_object()
            if (task.completed_at is None) or (request.data.get("completed_at") is None):
                if task.completed_at is None:
                    task.drawer.uncompleted_task_count += 1
                    task.drawer.completed_task_count -= 1
                else:
                    task.drawer.uncompleted_task_count -= 1
                    task.drawer.completed_task_count += 1   
            task.drawer.save()

            return self.partial_update(request, *args, **kwargs)
        except Exception as e:
            return e
    
    def delete(self, request, id, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
    
class TaskListPagination(PageNumberPagination):
    page_size = 1000
    
class TaskList(CreateMixin,
                  mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  generics.GenericAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsUserMatch]
    pagination_class = TaskListPagination

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