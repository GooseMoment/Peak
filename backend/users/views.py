from rest_framework import status, mixins, generics
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.conf import settings

from .models import User
from .serializers import UserSerializer
from api.request import AuthenticatedRequest


class UserDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "username"

    def get(self, request: Request, username: str, *args, **kwargs):
        instance = self.get_object()
        serializer = UserSerializer(
            instance, context={"is_me": request.user.get_username() == username}
        )
        return Response(serializer.data)

    def patch(self, request: Request, username: str, *args, **kwargs):
        if request.user.get_username() != username:
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
        return Response(
            {
                "code": "PATCHPASSWORD_WRONG_CURRENT_PASSWORD",
                "message": "wrong current password",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(new_password) < 8:
        return Response(
            {
                "code": "PATCHPASSWORD_PASSWORD_TOO_SHORT",
                "message": "password should be longer than 8.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    request.user.set_password(new_password)
    request.user.save()

    return Response(status=status.HTTP_200_OK)


@api_view(["POST"])
def upload_profile_img(request: AuthenticatedRequest):
    uploaded = request.FILES.get(
        "profile_img", None
    )  # None: only removes old profile_img

    # check file size
    if uploaded is not None and uploaded.size > settings.USER_PROFILE_IMG_SIZE_LIMIT:
        return Response(
            {
                "code": "UPLOADPROFILEIMG_FILE_TOO_LARGE",
                "message": f"file size should be less than {settings.USER_PROFILE_IMG_SIZE_LIMIT / (1024 * 1024)}MB.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    old = request.user.profile_img
    if old:
        old.delete()

    if uploaded is not None:
        request.user.profile_img.save(uploaded.name, uploaded)

    return Response(status=status.HTTP_200_OK)
