from rest_framework import mixins, generics
from rest_framework.filters import OrderingFilter

from .models import Drawer
from .serializers import DrawerSerializer
from .utils import normalize_drawers_order
from tasks.models import Task
from api.permissions import IsUserOwner


class DrawerDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    queryset = Drawer.objects.all()
    serializer_class = DrawerSerializer
    lookup_field = "id"
    permission_classes = [IsUserOwner]

    def get(self, request, id, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, id, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class DrawerList(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    serializer_class = DrawerSerializer
    permission_classes = [IsUserOwner]

    def get_queryset(self):
        queryset = Drawer.objects.filter(user=self.request.user).order_by("order").all()
        project_id = self.request.query_params.get("project", None)
        if project_id is not None:
            queryset = queryset.filter(project__id=project_id)

        ordering_fields = [
            "order",
            "name",
            "created_at",
            "uncompleted_task_count",
            "completed_task_count",
        ]
        ordering = self.request.GET.get("ordering", None)

        if ordering.lstrip("-") in ordering_fields:
            normalize_drawers_order(queryset, ordering)

        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
