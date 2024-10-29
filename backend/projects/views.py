from rest_framework import mixins, generics
from rest_framework.pagination import PageNumberPagination

from .models import Project
from .serializers import ProjectSerializer, ProjectSerializerForUserProjectList
from api.permissions import IsUserOwner
from api.mixins import CreateMixin


class ProjectDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
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
    page_size = 1000


class ProjectList(CreateMixin,
                  mixins.ListModelMixin,
                  generics.GenericAPIView):
    serializer_class = ProjectSerializer
    pagination_class = ProjectListPagination

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user).order_by("created_at").all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create_with_user(request, order=0, *args, **kwargs)


class UserProjectList(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = ProjectSerializerForUserProjectList
    pagination_class = ProjectListPagination

    def get_queryset(self):
        username = self.kwargs["username"]
        return Project.objects.filter(user__username=username).order_by("order").all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    