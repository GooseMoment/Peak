from django.http.request import HttpRequest
from django.contrib.auth.backends import BaseBackend, ModelBackend
from .models import User
from peak_auth.models import TOTPSecret


class AdminBackend(ModelBackend):
    def authenticate(
        self, request: HttpRequest, username=None, password=None, **kwargs
    ):
        if not request.path.startswith("/admin/"):
            return None

        return super().authenticate(request, username, password, **kwargs)


class UserBackend(BaseBackend):
    def authenticate(self, request, email: str, password: str, **kwargs):  # pyright: ignore [reportIncompatibleMethodOverride] -- the authenticate method can be overriden with different signatures
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None

        if not user.check_password(password):
            return None

        return user

    def get_user(self, user_id: int):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None


class UserTOTPBackend(BaseBackend):
    def authenticate(self, request, user: User, totp_code: str, **kwrags):  # pyright: ignore [reportIncompatibleMethodOverride] -- the authenticate method can be overriden with different signatures
        if user is None:
            return None

        if len(totp_code) != 6:
            return None

        try:
            totp_secret = TOTPSecret.objects.filter(user=user).get()
        except TOTPSecret.DoesNotExist:
            return None

        totp_agent = totp_secret.to_totp()
        codes = totp_agent.totp_with_offsets()

        if totp_code in codes:
            return user

        return None

    def get_user(self, user_id: int):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
