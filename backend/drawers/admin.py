from django.contrib import admin
from .models import Drawer
from api.admin import fieldset_base, readonly_fields_base

@admin.register(Drawer)
class DrawerAdmin(admin.ModelAdmin):
    ordering = ["-updated_at"]
    search_fields = ["user__username", "name"]
    autocomplete_fields = ["user", "project"]
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["name", "user", "project", "order", "privacy"],
            },
        ),
        (
            "Computed values",
            {
                "classes": ["collapse"],
                "fields": ["uncompleted_task_count", "completed_task_count"],
            },
        ),
        fieldset_base,
    ]