from rest_framework import mixins, generics

from .models import Drawer
from .serializers import DrawerSerializer
from api.permissions import IsUserOwner
from api.mixins import CreateMixin
from rest_framework.filters import OrderingFilter

from tasks.models import Task

from .utils import reorder_tasks, normalize_drawer_order

class DrawerDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    queryset = Drawer.objects.all()
    serializer_class = DrawerSerializer
    lookup_field = "id"
    permission_classes = [IsUserOwner]

    def get(self, request, id, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        try:
            task_id = request.data["task_id"]
            dragged_order = int(request.data["dragged_order"])
            target_order = int(request.data["target_order"])
            closest_edge = request.data["closest_edge"]
        except (ValueError, TypeError, KeyError):
            pass
        else:
            if (dragged_order is not None) or (target_order is not None):
                drawer: Drawer = Task.objects.filter(id=task_id).get().drawer
                reorder_tasks(drawer.tasks, dragged_order, target_order, closest_edge)
                normalize_drawer_order(drawer.tasks, "order")

        return self.partial_update(request, *args, **kwargs)
    
    def delete(self, request, id, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
    
class DrawerList(CreateMixin,
                  mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  generics.GenericAPIView):
    serializer_class = DrawerSerializer
    permission_classes = [IsUserOwner]
    filter_backends = [OrderingFilter]
    ordering_fields = ['name', 'created_at', 'uncompleted_task_count', 'completed_task_count']
    ordering = ['created_at']

    def get_queryset(self):
        queryset = Drawer.objects.filter(user=self.request.user).order_by("created_at").all()
        project_id = self.request.query_params.get("project", None)
        if project_id is not None:
            queryset = queryset.filter(project__id=project_id)
        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create_with_user(request, order=0, *args, **kwargs)