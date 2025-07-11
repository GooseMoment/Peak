from rest_framework import mixins, generics, status
from rest_framework.response import Response

from .models import Drawer
from .serializers import DrawerSerializer, DrawerReorderSerializer
from .utils import normalize_drawers_order
from api.permissions import IsUserOwner
from . import exceptions
from api.exceptions import RequiredFieldMissing, UnknownError

from rest_framework.exceptions import ValidationError


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

        if ordering is None:
            raise RequiredFieldMissing

        if ordering.lstrip("-") in ordering_fields:
            normalize_drawers_order(queryset, ordering)

        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        try:
            return self.create(request, *args, **kwargs)
        except ValidationError:
            raise exceptions.DrawerNameDuplicate
        except Exception:
            raise UnknownError


class DrawerReorderView(mixins.UpdateModelMixin, generics.GenericAPIView):
    serializer_class = DrawerReorderSerializer
    queryset = Drawer.objects.all()

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)

        drawers_data = serializer.validated_data

        ids = [item["id"] for item in drawers_data]
        id_to_order = {item["id"]: item["order"] for item in drawers_data}

        drawers = self.get_queryset().filter(id__in=ids)

        for drawer in drawers:
            drawer.order = id_to_order[drawer.id]

        Drawer.objects.bulk_update(drawers, ["order"])

        return Response(status=status.HTTP_200_OK)
