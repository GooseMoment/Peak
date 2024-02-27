from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate, login, logout

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status, mixins, generics
from rest_framework.decorators import api_view

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

    def get(self, request: Request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def patch(self, request: Request, username: str, *args, **kwargs):
        if request.user.username != username:
            return Response(status=status.HTTP_403_FORBIDDEN)

        # TODO: password change

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

@api_view(["POST"])
def sign_up(request: Request):
    if request.user.is_authenticated:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    payload = request.data
    
    required_fields = [
        "username", "display_name", "password", "email"
    ]

    new_user = User()
    for field in required_fields:
        if field not in payload:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        setattr(new_user, field, payload[field])
    
    new_user.set_password(payload["password"])
    new_user.save()

    return Response(status=status.HTTP_200_OK)

@login_required
@api_view(["GET"])
def sign_out(request: Request):
    logout(request)
    return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
def get_current_user(request: Request):
    if request.user.is_anonymous:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = UserSerializer(request.user._wrapped, personal=True)
    return Response(serializer.data)
