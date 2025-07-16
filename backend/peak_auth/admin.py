from django.contrib import admin

from .models import (
    AuthToken,
    EmailVerificationToken,
    PasswordRecoveryToken,
    TwoFactorAuthToken,
    TOTPSecret,
)


@admin.register(AuthToken)
class AuthTokenAdmin(admin.ModelAdmin):
    ordering = ("-created",)
    search_fields = (
        "digest",
        "token_key",
        "user__username",
        "user__email",
    )
    autocomplete_fields = ("user",)
    readonly_fields = ("created",)
    fieldsets = [
        (
            None,
            {
                "fields": (
                    "user",
                    "digest",
                    "token_key",
                    "created",
                    "expiry",
                ),
            },
        ),
        ("User Agent", {"fields": ("initial_ip", "browser", "os", "device")}),
    ]


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    ordering = ("-created_at",)
    search_fields = (
        "user__username",
        "user__email",
    )
    autocomplete_fields = ("user",)
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
    autocomplete_fields = ("user",)
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
    autocomplete_fields = ("user",)
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
    autocomplete_fields = ("user",)
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
