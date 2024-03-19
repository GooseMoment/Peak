from django.contrib import admin
from .models import TaskReminder, Notification

@admin.register(TaskReminder)
class TaskReminderAdmin(admin.ModelAdmin):
    pass

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    pass