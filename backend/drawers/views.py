from rest_framework import mixins, generics, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter
from rest_framework.exceptions import ValidationError

from .models import Drawer
from .serializers import DrawerSerializer, DrawerReorderSerializer
from .exceptions import DrawerNameDuplicate

from api.permissions import IsUserOwner
from api.exceptions import UnknownError

from projects.models import Project


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


class DrawerListPagination(PageNumberPagination):
    page_size = 20


class DrawerList(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    permission_classes = [IsUserOwner]
    serializer_class = DrawerSerializer
    pagination_class = DrawerListPagination
    filter_backends = [OrderingFilter]
    ordering_fields = [
        "order",
        "name",
        "created_at",
        "uncompleted_task_count",
        "completed_task_count",
    ]

    def get_queryset(self):
        queryset = (
            Drawer.objects.filter(user=self.request.user)
            .order_by("project", "order")
            .all()
        )

        project_id = self.request.query_params.get("project", None)
        if project_id is not None:
            queryset = queryset.filter(project__id=project_id)

        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        try:
            return self.create(request, *args, **kwargs)
        except ValidationError:
            raise DrawerNameDuplicate
        except Exception:
            raise UnknownError


class InboxDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView,
):
    serializer_class = DrawerSerializer
    permission_classes = [IsUserOwner]

    def get_object(self):
        return Drawer.objects.filter(
            user=self.request.user, project__type=Project.INBOX
        ).first()

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


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
