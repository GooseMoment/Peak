from django.contrib import admin

from .models import EmailVerificationToken


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


# Register your models here.
