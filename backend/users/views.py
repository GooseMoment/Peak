from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from django.core.validators import validate_email

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status, mixins, generics
from rest_framework.decorators import api_view

import re

from .models import User
from .serializers import UserSerializer

@method_decorator(login_required, name="dispatch")
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

@api_view(["POST"])
def sign_in(request: Request):
    email: str = request.data["email"]
    password: str = request.data["password"]

    user = authenticate(request, email=email, password=password)

    if user is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    login(request, user)

    return Response(status=status.HTTP_200_OK)

username_validation = re.compile(r"^[a-z0-9_-]{4,15}$")

@api_view(["POST"])
def sign_up(request: Request):
    if request.user.is_authenticated:
        return Response({
            "code": "SIGNUP_SIGNED_IN_USER",
            "message": "You're already signed in."
        }, status=status.HTTP_400_BAD_REQUEST)
    
    payload = request.data
    
    required_fields = [
        "username", "password", "email"
    ]

    new_user = User()
    for field in required_fields:
        if field not in payload:
            return Response({
                "code": "SIGNUP_REQUIRED_FIELDS_MISSING",
                "message": "There're some missing field(s)."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        setattr(new_user, field, payload[field])

    try:
        validate_email(payload["email"])
    except ValidationError as e:
        return Response({
            "code": "SIGNUP_EMAIL_WRONG",
            "message": "email validation error occuered."
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if len(payload["username"]) < 4:
        return Response({
            "code": "SIGNUP_USERNAME_TOO_SHORT",
            "message": "username should be longer than 4."
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not username_validation.match(payload["username"]):
        return Response({
            "code": "SIGNUP_USERNAME_WRONG",
            "message": "username should contain alphabets, underscore and digits only."
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if len(payload["password"]) < 8:
        return Response({
            "code": "SIGNUP_PASSWORD_TOO_SHORT",
            "message": "password should be longer than 8."
        }, status=status.HTTP_400_BAD_REQUEST)

    new_user.set_password(payload["password"])
    new_user.save()

    return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
def sign_out(request: Request):
    if request.user.is_anonymous:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    logout(request)
    return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
def get_me(request: Request):
    if request.user.is_anonymous:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = UserSerializer(request.user._wrapped, context={"is_me": True})
    return Response(serializer.data)

@api_view(["PATCH"])
def patch_password(request: Request):
    if request.user.is_anonymous:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
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
