from django.contrib import admin
from .models import User
from api.admin import fieldset_base, readonly_fields_base

# https://docs.djangoproject.com/en/4.2/ref/contrib/admin/#django.contrib.admin.register
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["username", "display_name", "email", "profile_img_uri", "bio"],
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