from django.contrib import admin
from .models import TaskReminder, Notification
from api.admin import fieldset_base, readonly_fields_base

@admin.register(TaskReminder)
class TaskReminderAdmin(admin.ModelAdmin):
    pass

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    ordering = ["created_at", "updated_at"]
    search_fields = ["user__username"]
    autocomplete_fields = ["user", "task", "reaction", "following", "peck"]
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["user", "type"],
            },
        ),
        (
            "Payloads",
            {
                "fields": ["task", "reaction", "following", "peck"],
            },
        ),
        fieldset_base,
    ]