from django.contrib import admin
from .models import Project
from api.admin import fieldset_base, readonly_fields_base


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    ordering = ["-updated_at"]
    search_fields = ["user__username", "name"]
    autocomplete_fields = ["user"]
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["user", "name", "order", "color", "type"],
            },
        ),
        fieldset_base,
    ]
