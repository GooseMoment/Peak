from rest_framework import status, mixins, generics
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import User
from .serializers import UserSerializer


class UserDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "username"

    def get(self, request: Request, username: str, *args, **kwargs):
        instance = self.get_object()
        serializer = UserSerializer(instance, context={"is_me": request.user.username == username})
        return Response(serializer.data)

    def patch(self, request: Request, username: str, *args, **kwargs):
        if request.user.username != username:
            return Response(status=status.HTTP_403_FORBIDDEN)

        return self.partial_update(request, *args, **kwargs)


@api_view(["GET"])
def get_me(request: Request):
    serializer = UserSerializer(request.user, context={"is_me": True})
    return Response(serializer.data)


@api_view(["PATCH"])
def patch_password(request: Request):
    payload = request.data
    current_password = payload.get("current_password", "")
    new_password = payload.get("new_password", "")

    if not request.user.check_password(current_password):
        return Response({
            "code": "PATCHPASSWORD_WRONG_CURRENT_PASSWORD",
            "message": "wrong current password",
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if len(new_password) < 8:
        return Response({
            "code": "PATCHPASSWORD_PASSWORD_TOO_SHORT",
            "message": "password should be longer than 8."
        }, status=status.HTTP_400_BAD_REQUEST)
    
    request.user.set_password(new_password)
    request.user.save()

    return Response(status=status.HTTP_200_OK)


@api_view(["POST"])
def upload_profile_img(request: Request):
    profile_img = request.FILES.get("profile_img", None) # None: only removes old profile_img

    old = request.user.profile_img
    if old:
        old.delete()

    request.user.profile_img = profile_img
    request.user.save()

    return Response(status=status.HTTP_200_OK)
