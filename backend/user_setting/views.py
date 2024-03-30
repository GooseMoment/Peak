from rest_framework import mixins, generics, permissions

from .models import UserSetting
from .serializers import UserSettingSerializer
from api.permissions import IsUserMatch

class UserSettingDetail(mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView):
    
    queryset = UserSetting.objects.all()
    serializer_class = UserSettingSerializer
    lookup_field = "user__username"
    lookup_url_kwarg = "username"
    permission_classes = [IsUserMatch]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
