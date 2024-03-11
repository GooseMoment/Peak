from rest_framework import mixins, generics

from .models import Project
from .serializers import ProjectSerializer
from api.permissions import IsUserMatch

class ProjectDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = "id"
    permission_classes = [IsUserMatch]

    def get(self, request, id, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def delete(self, request, id, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
    
class ProjectList(mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  generics.GenericAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsUserMatch]

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user).order_by("created_at").all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)