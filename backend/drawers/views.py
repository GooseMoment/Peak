from rest_framework import mixins, generics

from .models import Drawer
from .serializers import DrawerSerializer
from api.permissions import IsUserMatch
from api.views import CreateMixin

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
        return self.update(request, *args, **kwargs)
    
    def delete(self, request, id, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
    
class DrawerList(CreateMixin,
                  mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  generics.GenericAPIView):
    serializer_class = DrawerSerializer
    permission_classes = [IsUserMatch]

    def get_queryset(self):
        return Drawer.objects.filter(user=self.request.user).order_by("created_at").all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create_with_user(request, order=0, *args, **kwargs)