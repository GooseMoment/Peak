from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.base_user import AbstractBaseUser
from django.http import HttpRequest
from .models import User


class UserBackend(BaseBackend):
    def authenticate(self, request: HttpRequest, email: str, password: str, **kwargs):
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None

        if not user.check_password(password):
            return None

        return user

    def get_user(self, user_id: int) -> User:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

        return user
