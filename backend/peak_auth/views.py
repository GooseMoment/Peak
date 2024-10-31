from django.contrib.auth import authenticate, login
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import transaction
from django.db.utils import IntegrityError
from django.conf import settings

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle

from knox.views import LoginView as KnoxLoginView
import uuid
import re
from datetime import datetime, UTC

from users.models import User
from . import exceptions, utils
from .models import EmailVerificationToken, PasswordRecoveryToken


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


class SignUpView(GenericAPIView):
    permission_classes = (AllowAny, )
    required_fields = [
        "username", "password", "email",
    ]
    username_validation = re.compile(r"^[a-z0-9_]{4,15}$")

    def get_new_user(self) -> User:
        payload = self.request.data

        new_user = User()
        for field in self.required_fields:
            if field not in payload:
                raise exceptions.RequiredFieldMissing
            
            setattr(new_user, field, payload[field])

        try:
            validate_email(payload["email"])
        except ValidationError:
            raise exceptions.EmailInvalid
        
        if len(payload["username"]) < 4 or len(payload["username"]) > 15:
            raise exceptions.UsernameInvalidLength
        
        if not self.username_validation.match(payload["username"]):
            raise exceptions.UsernameInvalidFormat
        
        if len(payload["password"]) < 8:
            raise exceptions.PasswordInvalid
        
        new_user.set_password(payload["password"])
        return new_user

    def save_user(self, user: User, locale: str):
        try:
            user.save()
        except IntegrityError as e:
            if not "unique constraint" in str(e):
                raise exceptions.UnknownError

            if "email" in str(e):
                utils.send_mail_already_registered(user, locale)
                return Response(status=status.HTTP_200_OK)

            if "username" in str(e):
                raise exceptions.UsernameDuplicate

            raise exceptions.UnknownError

    @transaction.atomic
    def post(self, request: Request):
        if request.user.is_authenticated:
            raise exceptions.UserAlreadyAuthenticated

        locale = utils.get_first_language(request)
        
        new_user = self.get_new_user()
        res = self.save_user(new_user, locale)
        if res is not None:
            return res

        verification = EmailVerificationToken.objects.create(user=new_user, locale=locale)
        utils.send_mail_verification_email(new_user, verification)

        return Response(status=status.HTTP_200_OK)


class VerifyEmailVerificationToken(GenericAPIView):
    permission_classes = (AllowAny, )

    def post(self, request: Request):
        token_hex = request.data.get("token")
        if token_hex is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            token = uuid.UUID(hex=token_hex)
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            verification = EmailVerificationToken.objects.get(token=token)
        except EmailVerificationToken.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        if verification.verified_at is not None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        verification.verified_at = datetime.now(UTC)
        verification.save()
        verification.user.is_active = True
        verification.user.save()

        return Response({
            "email": verification.user.email,
        }, status=status.HTTP_200_OK)


class ResendAnonRateThrottle(AnonRateThrottle):
    rate = "5/hour" # up to 5 times a hour


class ResendEmailVerificationMail(GenericAPIView):
    permission_classes = (AllowAny, )
    throttle_classes = (ResendAnonRateThrottle, )

    def post(self, request: Request):
        email = request.data.get("email")
        if email is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_email(email)
        except ValidationError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        locale = utils.get_first_language(request)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            utils.send_mail_no_account(email, locale)
            return Response(status=status.HTTP_200_OK)
        
        if user.is_active:
            utils.send_mail_already_verified(user, locale)
            return Response(status=status.HTTP_200_OK)

        try:
            verification = EmailVerificationToken.objects.get(user=user)
        except EmailVerificationToken.DoesNotExist:
            utils.send_mail_already_verified(user, locale)
            return Response(status=status.HTTP_200_OK)
        
        if verification.verified_at is not None:
            utils.send_mail_already_verified(user, locale)
            return Response(status=status.HTTP_200_OK)
        
        now = datetime.now(UTC)

        if verification.last_sent_at is not None:
            delta = now - verification.last_sent_at

            if delta <= settings.EMAIL_SEND_INTERVAL_MIN:
                return Response({
                    "seconds": delta.seconds,
                }, status=status.HTTP_425_TOO_EARLY)
        
        utils.send_mail_verification_email(verification.user, verification)

        return Response(status=status.HTTP_200_OK)


class PasswordRecoveryAnonRateThrottle(AnonRateThrottle):
    rate = "5/minute" # up to 5 times a hour


class PasswordRecoveryView(GenericAPIView):
    permission_classes = (AllowAny, )

    # generate a token
    @throttle_classes((PasswordRecoveryAnonRateThrottle, ))
    def post(self, request: Request):
        email: str | None = request.data.get("email")
        
        if email is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        try:
            validate_email(email)
        except ValidationError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        locale = utils.get_first_language(request)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            utils.send_mail_no_account(email, locale)
            return Response(status=status.HTTP_200_OK)
        
        tokens = PasswordRecoveryToken.objects.filter(user=user)
        
        if len(tokens) != 0:
            tokens.delete()

        token = PasswordRecoveryToken.objects.create(user=user)
        token.expires_at = token.created_at + settings.PASSWORD_RECOVERY_TOKEN_TTL
        token.save()

        utils.send_mail_password_recovery(user, token.link, locale)

        return Response(status=status.HTTP_200_OK)

    # use the token
    def patch(self, request: Request):
        token_hex = request.data.get("token")
        if token_hex is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            token_uuid = uuid.UUID(hex=token_hex)
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        try:
            token = PasswordRecoveryToken.objects.get(token=token_uuid)
        except PasswordRecoveryToken.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        if token.expires_at < datetime.now(UTC):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        new_password = request.data.get("new_password")
        if new_password is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        if len(new_password) < 8:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        token.user.set_password(new_password)
        token.user.save()

        return Response(status=status.HTTP_200_OK)
