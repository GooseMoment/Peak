from rest_framework import mixins, generics

from .models import Drawer
from .serializers import DrawerSerializer
from api.permissions import IsUserMatch
from api.mixins import CreateMixin
from rest_framework.filters import OrderingFilter

class DrawerDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    queryset = Drawer.objects.all()
    serializer_class = DrawerSerializer
    lookup_field = "id"
    permission_classes = [IsUserMatch]

    def get(self, request, id, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
    def delete(self, request, id, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
    
class DrawerList(CreateMixin,
                  mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  generics.GenericAPIView):
    serializer_class = DrawerSerializer
    permission_classes = [IsUserMatch]
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