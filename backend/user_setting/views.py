from rest_framework import mixins, generics

from .models import UserSetting
from .serializers import UserSettingSerializer


class UserSettingDetail(
    mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView
):
    queryset = UserSetting.objects.all()
    serializer_class = UserSettingSerializer

    def get_object(self):
        queryset = self.get_queryset()
        obj = queryset.filter(user=self.request.user).get()
        return obj

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
