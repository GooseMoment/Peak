from django.contrib.auth import authenticate, login
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import transaction
from django.db.utils import IntegrityError

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status, mixins, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from knox.views import LoginView as KnoxLoginView

import uuid
from datetime import datetime, UTC

import re

from .models import User, UserEmailConfirmation
from .serializers import UserSerializer
from .utils import send_mail_confirm_email
from social.views import get_blocks

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

class SignInView(KnoxLoginView):
    permission_classes = (AllowAny, )

    def post(self, request):
        email: str = request.data["email"]
        password: str = request.data["password"]

        user: User | None = authenticate(request, email=email, password=password)

        if user is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        if not user.is_active:
            return Response(status=status.HTTP_403_FORBIDDEN)

        login(request, user)
        
        return super(SignInView, self).post(request, format=None)

username_validation = re.compile(r"^[a-z0-9_]{4,15}$")

@api_view(["POST"])
@permission_classes((AllowAny, ))
@transaction.atomic
def sign_up(request: Request):
    if request.user.is_authenticated:
        return Response({
            "code": "SIGNUP_SIGNED_IN_USER",
            "message": "You're already signed in."
        }, status=status.HTTP_400_BAD_REQUEST)
    
    payload = request.data
    
    required_fields = [
        "username", "password", "email",
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


    try:
        new_user.save()
    except IntegrityError as e:
        if not "unique constraint" in str(e):
            return Response({
                "code": "SIGNUP_UNKNOWN_ERROR",
                "message": "unknown error occuered."
            }, status=status.HTTP_400_BAD_REQUEST)

        if "email" in str(e):
            return Response({
                "code": "SIGNUP_EMAIL_EXISTS",
                "message": "a user with a provided email already exists."
            }, status=status.HTTP_400_BAD_REQUEST)

        if "username" in str(e):
            return Response({
                "code": "SIGNUP_USERNAME_EXISTS",
                "message": "a user with a provided username already exists."
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    locale = payload.get("locale", "")
    confirmation = UserEmailConfirmation.objects.create(user=new_user, token=uuid.uuid4().hex, locale=locale)
    
    send_mail_confirm_email(new_user, confirmation)

    return Response(status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes((AllowAny, ))
def patch_user_email_confirmation(request: Request):
    confirmation_token = request.data.get("token")
    if confirmation_token is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    try:
        confirmation = UserEmailConfirmation.objects.get(token=confirmation_token)
    except UserEmailConfirmation.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    if confirmation.confirmed_at is not None:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    confirmation.confirmed_at = datetime.now(UTC)
    confirmation.save()
    confirmation.user.is_active = True
    confirmation.user.save()

    return Response({
        "email": confirmation.user.email,
    }, status=status.HTTP_200_OK)

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

@api_view(["GET"])
def get_my_blocks(request: Request):
    return get_blocks(request._request, request.user.username)
