from rest_framework import mixins, generics, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView

from django.db.models import Q, F, Value

from projects.models import Project
from drawers.models import Drawer
from tasks.models import Task
from .serializers import ProjectSearchSerializer, DrawerSearchSerializer, TaskSearchSerializer
from projects.exceptions import ProjectNameDuplicate

from api.permissions import IsUserOwner
from api.exceptions import UnknownError
from api.serializers import ReorderSerializer

class SearchPagination(PageNumberPagination):
    page_size = 20
    
    # page size 조절 가능하게
    page_size_query_param = "page_size"
    max_page_size = 100

# 하나의 view에서 여러 serializer를 부를 거라 복잡해도 그냥 APIView가 적합할 거 같음
# 파라미터 종류가 많아지면 django-filter를 적극적으로 고려해 보자...
class ProjectSearchView(APIView):
    def get(self, request, *args, **kwargs):
        q = request.query_params.get("query", "").strip()

        print(q)
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