from django.contrib import admin
from .models import Task
from api.admin import fieldset_base, readonly_fields_base

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    ordering = ["-updated_at"]
    search_fields = ["user__username", "name"]
    autocomplete_fields = ["user", "drawer"]
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["user", "drawer", "name", "priority", "privacy", "order", "memo", "repeat"],
            },
        ),
        (
            "Date & Time",
            {
                "fields": ["completed_at", "due_date", "due_time"],
            },
        ),
        fieldset_base,
    ]