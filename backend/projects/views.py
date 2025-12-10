from rest_framework import mixins, generics, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView

from django.db.models import Q, F, Value

from .models import Project
from drawers.models import Drawer
from tasks.models import Task
from .serializers import ProjectSerializer, ProjectSerializerForUserProjectList, ProjectSearchSerializer, DrawerSearchSerializer, TaskSearchSerializer
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
        except ValidationError as e:
            if "unique" in str(e):
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

        projects_data = serializer.validated_data

        ids = [item["id"] for item in projects_data]
        id_to_order = {item["id"]: item["order"] for item in projects_data}

        projects = self.get_queryset().filter(id__in=ids)

        for project in projects:
            project.order = id_to_order[project.id]

        Project.objects.bulk_update(projects, ["order"])

        return Response(status=status.HTTP_200_OK)

class ProjectSearchPagination(PageNumberPagination):
    page_size = 20

# 하나의 view에서 여러 serializer를 부를 거라 복잡해도 그냥 APIView가 적합할 거 같음
# 파라미터 종류가 많아지면 django-filter를 적극적으로 고려해 보자...
class ProjectSearchView(APIView):
    def get(self, request, *args, **kwargs):
        q = request.query_params.get("query", "").strip()

        # query가 비어있으면 빈 결과 반환
        # TODO: 나중에 프로젝트 페이지와 합치게 되면 전부 보이는 걸로 바뀌어야 할 지도?
        if not q:
            return Response({
                "projects": [],
                "drawers": [],
                "tasks": [],
            })

        project_qs = Project.objects.filter(
            Q(name__icontains=q)
        )

        drawer_qs = Drawer.objects.filter(
            Q(name__icontains=q)
        )

        task_qs = Task.objects.filter(
            Q(name__icontains=q)
        )

        project_data = ProjectSearchSerializer(project_qs, many=True).data
        drawer_data = DrawerSearchSerializer(drawer_qs, many=True).data
        task_data = TaskSearchSerializer(task_qs, many=True).data

        return Response({
            "projects": project_data,
            "drawers": drawer_data,
            "tasks": task_data,
        })