from django.contrib import admin
from .models import User, EmailVerificationToken
from api.admin import fieldset_base, readonly_fields_base

# https://docs.djangoproject.com/en/4.2/ref/contrib/admin/#django.contrib.admin.register
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    ordering = ["-last_login"]
    search_fields = ["username", "email"]
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["username", "display_name", "email", "profile_img", "bio", "header_color"],
            },
        ),
        (
            "Computed values",
            {
                "classes": ["collapse"],
                "fields": ["followings_count", "followers_count"],
            },
        ),
        (
            "Auth & Permissions",
            {
                "classes": ["collapse"],
                "fields": ["password", "last_login", "groups", "user_permissions", "is_staff", "is_active"],
            },
        ),
        fieldset_base,
    ]

@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    ordering = ("-created_at", )
    search_fields = ("user__username", "user__email", )
    readonly_fields = ("created_at", )
    fieldsets = [
        (
            None,
            {
                "fields": ("user", "token", "verified_at", "last_sent_at", "created_at", ),
            },
        ),
    ]
