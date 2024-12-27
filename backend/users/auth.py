from django.contrib.auth.backends import BaseBackend

from .models import User
from peak_auth.models import TOTPSecret


class UserBackend(BaseBackend):
    def authenticate(self, request, email: str, password: str, **kwargs):
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


class UserTOTPBackend(BaseBackend):
    def authenticate(self, request, user: User, totp_code: str, **kwrags):
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

    def get_user(self, user_id: int) -> User:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
        
        return user

