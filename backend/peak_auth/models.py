from django.db import models
from django.conf import settings

from users.models import User
from .totp import TOTP

import uuid


class EmailVerificationToken(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
    )

    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    locale = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    last_sent_at = models.DateTimeField(null=True, blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"EmailVerficationToken for {self.user}"
    
    @property
    def link(self) -> str:
        return f"{settings.SCHEME}{settings.WEB_HOSTNAME}/sign/verification/?token={self.token.hex}"

    class Meta:
        db_table = "email_verification_tokens"


class PasswordRecoveryToken(models.Model):
    token = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"PasswordRecoveryToken for {self.user}"
    
    @property
    def link(self) -> str:
        return f"{settings.SCHEME}{settings.WEB_HOSTNAME}/sign/password-recovery/?token={self.token.hex}"

    class Meta:
        db_table = "password_recovery_tokens"


class TwoFactorAuthToken(models.Model):
    token = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="two_factor_token",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    try_count = models.IntegerField(default=0)

    def __str__(self) -> str:
        return f"TwoFactorAuthToken for {self.user}"

    class Meta:
        db_table = "two_factor_auth_tokens"
        constraints = [
            models.UniqueConstraint(fields=["user"], name="constraint_user"),
        ]


class TOTPSecret(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="totp_secret",
    )

    secret = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)

    def to_totp(self):
        return TOTP(self.secret, 6)

    def __str__(self) -> str:
        return f"TOTPSecret for {self.user}"

    class Meta:
        db_table = "totp_secrets"

