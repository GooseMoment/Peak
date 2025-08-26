from rest_framework import mixins, generics, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination

from .models import Project
from .serializers import ProjectSerializer, ProjectSerializerForUserProjectList
from .exceptions import ProjectNameDuplicate

from api.permissions import IsUserOwner
from api.exceptions import UnknownError
from api.serializers import ReorderSerializer


class ProjectDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = "id"
    permission_classes = [IsUserOwner]

    def get(self, request, id, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, id, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class ProjectListPagination(PageNumberPagination):
    page_size = 20


class ProjectList(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    serializer_class = ProjectSerializer
    pagination_class = ProjectListPagination

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user).order_by("order").all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        try:
            return self.create(request, *args, **kwargs)
        except ValidationError:
            raise ProjectNameDuplicate
        except Exception:
            raise UnknownError


class InboxProjectDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView,
):
    serializer_class = ProjectSerializer
    permission_classes = [IsUserOwner]

    def get_object(self):
        return Project.objects.filter(
            user=self.request.user, type=Project.INBOX
        ).first()

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class UserProjectList(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = ProjectSerializerForUserProjectList
    pagination_class = ProjectListPagination

    def get_queryset(self):
        username = self.kwargs["username"]
        return Project.objects.filter(user__username=username).order_by("order").all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class ProjectReorderView(mixins.UpdateModelMixin, generics.GenericAPIView):
    serializer_class = ReorderSerializer
    queryset = Project.objects.all()

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)

        tasks_data = serializer.validated_data

        ids = [item["id"] for item in tasks_data]
        id_to_order = {item["id"]: item["order"] for item in tasks_data}

        projects = self.get_queryset().filter(id__in=ids)

        for project in projects:
            project.order = id_to_order[project.id]

        Project.objects.bulk_update(projects, ["order"])

        return Response(status=status.HTTP_200_OK)
