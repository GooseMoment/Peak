from django.contrib import admin
from .models import Announcement, Heart
from api.admin import fieldset_base, readonly_fields_base

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    ordering = ["-created_at"]
    search_fields = ["title", "content"]
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["title", "content"],
            },
        ),
        fieldset_base,
    ]

@admin.register(Heart)
class HeartAdmin(admin.ModelAdmin):
    ordering = ["-created_at"]
    search_fields = ["user__username", "announcement__title"]
    autocomplete_fields = ("user", "announcement", )
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["user", "announcement"],
            },
        ),
        fieldset_base,
    ]
