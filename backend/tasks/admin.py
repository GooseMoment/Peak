from django.contrib import admin
from .models import Task
from api.admin import fieldset_base, readonly_fields_base

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["user", "drawer", "name", "priority", "privacy", "memo", "repeat"],
            },
        ),
        (
            "Date & Time",
            {
                "fields": ["completed_at", "due_date", "due_time", "reminder_datetime"],
            },
        ),
        fieldset_base,
    ]