from django.contrib import admin
from .models import TaskReminder, Notification, WebPushSubscription
from api.admin import fieldset_base, readonly_fields_base


@admin.register(TaskReminder)
class TaskReminderAdmin(admin.ModelAdmin):
    ordering = ["created_at", "updated_at"]
    search_fields = ["task__user__username", "task__id"]
    autocomplete_fields = ["task"]
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["task", "scheduled", "delta"],
            },
        ),
        fieldset_base,
    ]


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    ordering = ["-updated_at"]
    search_fields = ["user__username"]
    autocomplete_fields = ["user", "task_reminder", "reaction", "following", "peck"]
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
                "fields": ["task_reminder", "reaction", "following", "peck"],
            },
        ),
        fieldset_base,
    ]


@admin.register(WebPushSubscription)
class WebPushSubscriptionAdmin(admin.ModelAdmin):
    ordering = ["-updated_at"]
    search_fields = ["user__username", "token__digest"]
    autocomplete_fields = ["user", "token"]
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["user", "token", "locale", "excluded_types", "fail_cnt"],
            },
        ),
        (
            "PushSubscription",
            {
                "fields": ["endpoint", "auth", "p256dh", "expiration_time"],
            },
        ),
        fieldset_base,
    ]
