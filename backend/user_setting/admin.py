from django.contrib import admin
from .models import UserSetting
from api.admin import fieldset_base, readonly_fields_base

@admin.register(UserSetting)
class UserSettingAdmin(admin.ModelAdmin):
    ordering = ["-updated_at"]
    search_fields = ["user__username", "id"]
    autocomplete_fields = ["user"]
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["user"],
            },
        ),
        (
            "Social",
            {
                "fields": [
                    "follow_request_approval_manually",
                    "follow_request_approval_for_followings",
                    "follow_list_privacy",
                    "favorite_emojis",
                    "dislikable_emojis",
                ],
            },
        ),
        fieldset_base,
    ]
