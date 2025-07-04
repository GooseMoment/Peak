from django.contrib import admin

from .models import (
    EmailVerificationToken,
    PasswordRecoveryToken,
    TwoFactorAuthToken,
    TOTPSecret,
)


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    ordering = ("-created_at",)
    search_fields = (
        "user__username",
        "user__email",
    )
    readonly_fields = (
        "created_at",
        "token",
    )
    fieldsets = [
        (
            None,
            {
                "fields": (
                    "user",
                    "token",
                    "verified_at",
                    "last_sent_at",
                    "created_at",
                ),
            },
        ),
    ]


@admin.register(PasswordRecoveryToken)
class PasswordRecoveryTokenAdmin(admin.ModelAdmin):
    ordering = ("-created_at",)
    search_fields = (
        "user__username",
        "user__email",
    )
    readonly_fields = (
        "created_at",
        "token",
        "link",
    )
    fieldsets = [
        (
            None,
            {
                "fields": (
                    "user",
                    "token",
                    "created_at",
                    "expires_at",
                    "link",
                ),
            },
        ),
    ]


@admin.register(TwoFactorAuthToken)
class TwoFactorAuthTokenAdmin(admin.ModelAdmin):
    ordering = ("-created_at",)
    search_fields = (
        "user__username",
        "user__email",
    )
    readonly_fields = (
        "created_at",
        "token",
    )
    fieldsets = [
        (
            None,
            {
                "fields": (
                    "user",
                    "token",
                    "created_at",
                    "try_count",
                ),
            },
        ),
    ]


@admin.register(TOTPSecret)
class TOTPSecretAdmin(admin.ModelAdmin):
    ordering = ("-created_at",)
    search_fields = (
        "user__username",
        "user__email",
    )
    readonly_fields = ("created_at",)
    fieldsets = [
        (
            None,
            {
                "fields": (
                    "user",
                    "secret",
                    "created_at",
                ),
            },
        ),
    ]
