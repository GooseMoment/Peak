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
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle
from rest_framework.exceptions import ValidationError as APIValidationError

from knox.views import LoginView as KnoxLoginView
import uuid
from datetime import datetime, UTC
import re

from users.models import User
from .models import (
    EmailVerificationToken,
    PasswordRecoveryToken,
    TOTPSecret,
    TwoFactorAuthToken,
)
from .mails import (
    get_first_language,
    send_mail_verification_email,
    send_mail_already_verified,
    send_mail_no_account,
    send_mail_password_recovery,
)
from .totp import create_totp_secret, TOTP


class SignInView(KnoxLoginView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email: str = request.data["email"]
        password: str = request.data["password"]

        user: User | None = authenticate(request, email=email, password=password)

        if user is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if not user.is_active:
            return Response(status=status.HTTP_403_FORBIDDEN)

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
        return super(SignInView, self).post(request, format=None)


class TOTPAuthenticationView(KnoxLoginView):
    permission_classes = (AllowAny,)

    def post(self, request: Request):
        try:
            token_hex = request.data["token"]
            code = request.data["code"]
        except KeyError:
            # TODO: replace Response to the custom exception
            return Response(
                {
                    "code": "REQUIRED_FIELD_MISSING",
                    "message": "Missing fields",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = uuid.UUID(hex=token_hex)
        except ValueError:
            raise APIValidationError(["format of token is valid."])

        try:
            self.tfat = TwoFactorAuthToken.objects.filter(token=token).get()
        except TwoFactorAuthToken.DoesNotExist:
            # TODO: replace Response to the custom exception
            return Response(
                {
                    "code": "INVALID_TOKEN",
                    "message": "Invalid token",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        user = authenticate(request, user=self.tfat.user, totp_code=code)
        if user is None:
            return self.process_fail(request)

        self.tfat.delete()
        return self.process_login(request, user)

    def process_login(self, request: Request, user: User):
        login(request, user)
        return super(TOTPAuthenticationView, self).post(request, format=None)

    def process_fail(self, request: Request):
        self.tfat.try_count += 1
        if (
            self.tfat.try_count
            >= settings.TWO_FACTOR_AUTHENTICATION["ALLOWED_TRIES_PER_SIGN_IN"]
        ):
            self.tfat.delete()
            # TODO: replace Response to the custom exception
            # TODO: add sign in timed restriction
            return Response(
                {
                    "code": "TOKEN_OUT_OF_COUNTS",
                    "message": "Out of try counts. Please sign in again.",
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        self.tfat.save()

        # TODO: replace Response to the custom exception
        return Response(
            {
                "code": "CREDENTIAL_INVALID",
                "message": "Invalid credential.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class TOTPRegisterView(GenericAPIView):
    key_prefix = "totp-secret-pending"
    cache_timeout = 60 * 30  # 30 minutes

    def get_cahce_key(self) -> str:
        return self.key_prefix + "-" + self.request.user.username

    def get_cached_secret(self) -> str | None:
        key = self.get_cahce_key()
        return cache.get(key)

    def create_and_set_secret(self) -> str:
        key = self.get_cahce_key()
        secret = create_totp_secret()
        cache.set(key, secret, self.cache_timeout)
        return secret

    def clear_cached_secret(self):
        key = self.get_cahce_key()
        cache.delete(key)

    # get wheter TOTP is enabled or not and its created_at if exists
    def get(self, request: Request):
        exists = TOTPSecret.objects.filter(user=request.user).exists()

        if not exists:
            return Response(
                {
                    "enabled": False,
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
                "uri": totp.get_uri(request.user.username, "Peak"),
            },
            status=status.HTTP_200_OK,
        )

    # validate and complete registration TOTP
    def patch(self, request: Request):
        secret = self.get_cached_secret()
        if secret is None:
            # TODO: replace Response to the custom exception
            return Response(
                {
                    "code": "BAD_REQUEST",
                    "message": "TOTP registration not started.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            code = request.data["code"]
        except KeyError:
            # TODO: replace Response to the custom exception
            return Response(
                {
                    "code": "REQUIRED_FIELD_MISSING",
                    "message": "Missing fields",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        totp = TOTP(secret)
        codes = totp.totp_with_offsets()
        if code not in codes:
            # TODO: replace Response to the custom exception
            return Response(
                {
                    "code": "CREDENTIAL_INVALID",
                    "message": "Invalid credential.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

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


username_validation = re.compile(r"^[a-z0-9_]{4,15}$")


@api_view(["POST"])
@permission_classes((AllowAny,))
@transaction.atomic
def sign_up(request: Request):
    if request.user.is_authenticated:
        return Response(
            {"code": "SIGNUP_SIGNED_IN_USER", "message": "You're already signed in."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    payload = request.data

    required_fields = [
        "username",
        "password",
        "email",
    ]

    new_user = User()
    for field in required_fields:
        if field not in payload:
            return Response(
                {
                    "code": "SIGNUP_REQUIRED_FIELDS_MISSING",
                    "message": "There're some missing field(s).",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        setattr(new_user, field, payload[field])

    try:
        validate_email(payload["email"])
    except ValidationError:
        return Response(
            {
                "code": "SIGNUP_EMAIL_WRONG",
                "message": "email validation error occuered.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(payload["username"]) < 4:
        return Response(
            {
                "code": "SIGNUP_USERNAME_TOO_SHORT",
                "message": "username should be longer than 4.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not username_validation.match(payload["username"]):
        return Response(
            {
                "code": "SIGNUP_USERNAME_WRONG",
                "message": "username should contain alphabets, underscore and digits only.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(payload["password"]) < 8:
        return Response(
            {
                "code": "SIGNUP_PASSWORD_TOO_SHORT",
                "message": "password should be longer than 8.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    new_user.set_password(payload["password"])

    try:
        new_user.save()
    except IntegrityError as e:
        if "unique constraint" not in str(e):
            return Response(
                {"code": "SIGNUP_UNKNOWN_ERROR", "message": "unknown error occuered."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if "email" in str(e):
            return Response(
                {
                    "code": "SIGNUP_EMAIL_EXISTS",
                    "message": "a user with a provided email already exists.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if "username" in str(e):
            return Response(
                {
                    "code": "SIGNUP_USERNAME_EXISTS",
                    "message": "a user with a provided username already exists.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    locale = get_first_language(request)

    verification = EmailVerificationToken.objects.create(user=new_user, locale=locale)

    send_mail_verification_email(new_user, verification)

    return Response(status=status.HTTP_200_OK)


class VerifyEmailVerificationToken(GenericAPIView):
    permission_classes = (AllowAny,)

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
            return Response(status=status.HTTP_400_BAD_REQUEST)

        locale = get_first_language(request)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            send_mail_no_account(email, locale)
            return Response(status=status.HTTP_200_OK)

        if user.is_active:
            send_mail_already_verified(user, locale)
            return Response(status=status.HTTP_200_OK)

        try:
            verification = EmailVerificationToken.objects.get(user=user)
        except EmailVerificationToken.DoesNotExist:
            send_mail_already_verified(user, locale)
            return Response(status=status.HTTP_200_OK)

        if verification.verified_at is not None:
            send_mail_already_verified(user, locale)
            return Response(status=status.HTTP_200_OK)

        now = datetime.now(UTC)

        if verification.last_sent_at is not None:
            delta = now - verification.last_sent_at

            if delta <= settings.EMAIL_SEND_INTERVAL_MIN:
                return Response(
                    {
                        "seconds": delta.seconds,
                    },
                    status=status.HTTP_425_TOO_EARLY,
                )

        send_mail_verification_email(verification.user, verification)

        return Response(status=status.HTTP_200_OK)


class PasswordRecoveryAnonRateThrottle(AnonRateThrottle):
    rate = "5/minute"  # up to 5 times a hour


class PasswordRecoveryView(GenericAPIView):
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
            return Response(status=status.HTTP_400_BAD_REQUEST)

        locale = get_first_language(request)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            send_mail_no_account(email, locale)
            return Response(status=status.HTTP_200_OK)

        tokens = PasswordRecoveryToken.objects.filter(user=user)

        if len(tokens) != 0:
            tokens.delete()

        token = PasswordRecoveryToken.objects.create(user=user)
        token.expires_at = token.created_at + settings.PASSWORD_RECOVERY_TOKEN_TTL
        token.save()

        send_mail_password_recovery(user, token.link, locale)

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
