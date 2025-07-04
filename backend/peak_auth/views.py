from django.contrib.auth import authenticate, login
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.core.cache import cache
from django.db import transaction
from django.db.utils import IntegrityError
from django.conf import settings

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.decorators import throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle
from rest_framework.exceptions import ValidationError as APIValidationError

from knox.views import LoginView as KnoxLoginView
import uuid
import re
from datetime import datetime, UTC

from users.models import User
from .models import (
    EmailVerificationToken,
    PasswordRecoveryToken,
    TOTPSecret,
    TwoFactorAuthToken,
)
from .totp import create_totp_secret, TOTP
from . import exceptions, mails
from api.exceptions import RequiredFieldMissing


class SignInView(KnoxLoginView):
    permission_classes = (AllowAny,)

    def post(self, request: Request, format=None):
        email: str = request.data["email"]
        password: str = request.data["password"]

        user = authenticate(request, email=email, password=password)

        if user is None:
            raise exceptions.CredentialInvalid

        if not user.is_active:
            raise exceptions.EmailNotVerified

        totp_enabled = TOTPSecret.objects.filter(user=user).exists()
        if totp_enabled:
            TwoFactorAuthToken.objects.filter(user=user).delete()
            tfat = TwoFactorAuthToken.objects.create(user=user)
            return Response(
                {
                    "user": {
                        "email": user.email,
                        "username": user.username,
                    },
                    "two_factor_auth": {
                        "token": tfat.token,
                    },
                }
            )

        login(request, user)
        return super(SignInView, self).post(request, format=format)


class TOTPAuthenticationView(KnoxLoginView):
    permission_classes = (AllowAny,)

    def post(self, request: Request, format=None):
        try:
            token_hex = request.data["token"]
            code = request.data["code"]
        except KeyError:
            raise RequiredFieldMissing

        try:
            token = uuid.UUID(hex=token_hex)
        except ValueError:
            raise APIValidationError(["format of token is valid."])

        try:
            self.tfat = TwoFactorAuthToken.objects.filter(token=token).get()
        except TwoFactorAuthToken.DoesNotExist:
            raise exceptions.TokenInvalid

        user = authenticate(request, user=self.tfat.user, totp_code=code)
        if user is None:
            return self.process_fail(request)

        self.tfat.delete()
        return self.process_login(request, user, format)

    def process_login(self, request: Request, user, format):
        login(request, user)
        return super(TOTPAuthenticationView, self).post(request, format=format)

    def process_fail(self, request: Request):
        self.tfat.try_count += 1
        if (
            self.tfat.try_count
            >= settings.TWO_FACTOR_AUTHENTICATION["ALLOWED_TRIES_PER_SIGN_IN"]
        ):
            self.tfat.delete()
            # TODO: add sign in timed restriction
            raise exceptions.TokenOutOfCounts

        self.tfat.save()

        raise exceptions.CredentialInvalid


class TOTPRegisterView(GenericAPIView):
    key_prefix = "totp-secret-pending"
    cache_timeout = 60 * 30  # 30 minutes

    def get_cache_key(self) -> str:
        return self.key_prefix + "-" + self.request.user.get_username()

    def get_cached_secret(self) -> str | None:
        key = self.get_cache_key()
        return cache.get(key)

    def create_and_set_secret(self) -> str:
        key = self.get_cache_key()
        secret = create_totp_secret()
        cache.set(key, secret, self.cache_timeout)
        return secret

    def clear_cached_secret(self):
        key = self.get_cache_key()
        cache.delete(key)

    # get wheter TOTP is enabled or not and its created_at if exists
    def get(self, request: Request):
        exists = TOTPSecret.objects.filter(user=request.user).exists()

        if not exists:
            return Response(
                {
                    "enabled": False,
                    "created_at": None,
                }
            )

        totp_secret = TOTPSecret.objects.get(user=request.user)
        return Response(
            {
                "enabled": True,
                "created_at": totp_secret.created_at,
            }
        )

    # create a new TOTP secret
    def post(self, request: Request):
        secret = self.create_and_set_secret()
        totp = TOTP(secret)

        return Response(
            {
                "secret": secret,
                "uri": totp.get_uri(request.user.get_username(), "Peak"),
            },
            status=status.HTTP_200_OK,
        )

    # verify and complete the TOTP registration
    def patch(self, request: Request):
        secret = self.get_cached_secret()
        if secret is None:
            raise exceptions.NoPendingTOTPRegistration

        try:
            code = request.data["code"]
        except KeyError:
            raise RequiredFieldMissing

        totp = TOTP(secret)
        codes = totp.totp_with_offsets()
        if code not in codes:
            raise exceptions.CredentialInvalid

        TOTPSecret.objects.filter(user=request.user).delete()
        TOTPSecret.objects.create(user=request.user, secret=secret)
        return Response(
            {
                "code": "SUCCESS",
                "message": "TOTP two-factor authentication was successfully added.",
            },
            status=status.HTTP_200_OK,
        )

    # disable and delete TOTP
    def delete(self, request: Request):
        TOTPSecret.objects.filter(user=request.user).delete()

        return Response(
            {
                "code": "SUCCESS",
                "message": "Your TOTP two-factor authentication was successfully disabled and deleted.",
            },
            status=status.HTTP_200_OK,
        )


class SignUpView(GenericAPIView):
    permission_classes = (AllowAny,)
    required_fields = [
        "username",
        "password",
        "email",
    ]
    username_validation = re.compile(r"^[a-z0-9_]{4,15}$")

    def get_new_user(self) -> User:
        payload = self.request.data

        new_user = User()
        for field in self.required_fields:
            if field not in payload:
                raise RequiredFieldMissing

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
            if "unique constraint" not in str(e):
                raise exceptions.UnknownError

            if "email" in str(e):
                mails.send_mail_already_registered(user, locale)
                return Response(status=status.HTTP_200_OK)

            if "username" in str(e):
                raise exceptions.UsernameDuplicate

            raise exceptions.UnknownError

    @transaction.atomic
    def post(self, request: Request):
        if request.user.is_authenticated:
            raise exceptions.UserAlreadyAuthenticated

        locale = mails.get_first_language(request)

        new_user = self.get_new_user()
        res = self.save_user(new_user, locale)
        if res is not None:
            return res

        verification = EmailVerificationToken.objects.create(
            user=new_user, locale=locale
        )
        mails.send_mail_verification_email(new_user, verification)

        return Response(status=status.HTTP_200_OK)


class TokenView(GenericAPIView):
    def get_token(self):
        token_hex = self.request.data.get("token")
        if token_hex is None:
            raise APIValidationError(["token is required."])

        try:
            token = uuid.UUID(hex=token_hex)
        except ValueError:
            raise APIValidationError(["format of token is invalid."])

        return token


class VerifyEmailVerificationToken(TokenView):
    permission_classes = (AllowAny,)

    def post(self, request: Request):
        token = self.get_token()

        try:
            verification = EmailVerificationToken.objects.get(token=token)
        except EmailVerificationToken.DoesNotExist:
            raise exceptions.TokenInvalid

        if verification.verified_at is not None:
            raise exceptions.TokenInvalid

        verification.verified_at = datetime.now(UTC)
        verification.save()
        verification.user.is_active = True
        verification.user.save()

        return Response(
            {
                "email": verification.user.email,
            },
            status=status.HTTP_200_OK,
        )


class ResendAnonRateThrottle(AnonRateThrottle):
    rate = "5/hour"  # up to 5 times a hour


class ResendEmailVerificationMail(GenericAPIView):
    permission_classes = (AllowAny,)
    throttle_classes = (ResendAnonRateThrottle,)

    def post(self, request: Request):
        email = request.data.get("email")
        if email is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_email(email)
        except ValidationError:
            raise exceptions.EmailInvalid

        locale = mails.get_first_language(request)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            mails.send_mail_no_account(email, locale)
            return Response(status=status.HTTP_200_OK)

        if user.is_active:
            mails.send_mail_already_verified(user, locale)
            return Response(status=status.HTTP_200_OK)

        try:
            verification = EmailVerificationToken.objects.get(user=user)
        except EmailVerificationToken.DoesNotExist:
            mails.send_mail_already_verified(user, locale)
            return Response(status=status.HTTP_200_OK)

        if verification.verified_at is not None:
            mails.send_mail_already_verified(user, locale)
            return Response(status=status.HTTP_200_OK)

        now = datetime.now(UTC)

        if verification.last_sent_at is not None:
            delta = now - verification.last_sent_at

            if delta <= settings.EMAIL_SEND_INTERVAL_MIN:
                return Response(
                    {
                        "seconds": delta.seconds,
                    },
                    status=status.HTTP_425_TOO_EARLY,  # pyright: ignore [reportAttributeAccessIssue] -- djangorestframework-types missing type
                )

        mails.send_mail_verification_email(verification.user, verification)

        return Response(status=status.HTTP_200_OK)


class PasswordRecoveryAnonRateThrottle(AnonRateThrottle):
    rate = "5/minute"  # up to 5 times a hour


class PasswordRecoveryView(TokenView):
    permission_classes = (AllowAny,)

    # generate a token
    @throttle_classes((PasswordRecoveryAnonRateThrottle,))
    def post(self, request: Request):
        email: str | None = request.data.get("email")

        if email is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_email(email)
        except ValidationError:
            raise exceptions.EmailInvalid

        locale = mails.get_first_language(request)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            mails.send_mail_no_account(email, locale)
            return Response(status=status.HTTP_200_OK)

        tokens = PasswordRecoveryToken.objects.filter(user=user)

        if len(tokens) != 0:
            tokens.delete()

        token = PasswordRecoveryToken.objects.create(user=user)
        token.expires_at = token.created_at + settings.PASSWORD_RECOVERY_TOKEN_TTL
        token.save()

        mails.send_mail_password_recovery(user, token.link, locale)

        return Response(status=status.HTTP_200_OK)

    # use the token
    def patch(self, request: Request):
        token_uuid = self.get_token()

        try:
            token = PasswordRecoveryToken.objects.get(token=token_uuid)
        except PasswordRecoveryToken.DoesNotExist:
            raise exceptions.TokenInvalid

        if token.expires_at is not None and token.expires_at < datetime.now(UTC):
            raise exceptions.TokenInvalid

        new_password = request.data.get("new_password")
        if new_password is None or len(new_password) < 8:
            raise exceptions.PasswordInvalid

        token.user.set_password(new_password)
        token.user.save()

        return Response(status=status.HTTP_200_OK)
