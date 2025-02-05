from django.core.management.base import BaseCommand, CommandParser
from django.core.cache import cache

from notifications.models import Notification, TaskReminder
from datetime import datetime, UTC


class Command(BaseCommand):
    help = "Notify TaskReminders in the queue."

    def add_arguments(self, parser: CommandParser):
        return super().add_arguments(parser)

    def handle(self, *args, **options):
        now = datetime.now(UTC).replace(second=0, microsecond=0)
        now_timestamp = now.isoformat()

        key = "reminders_" + now_timestamp
        reminders: list[TaskReminder] | None = cache.get(key)

        if reminders is None or len(reminders) == 0:
            print("[NOTIFY] No TaskReminders.")
            return

        print(f"[NOTIFY] Got {len(reminders)} TaskReminders.")

        for reminder in reminders:
            if reminder.scheduled != now:
                continue

            try:
                user = reminder.task.user

                Notification.objects.create(
                    user=user,
                    task_reminder=reminder,
                    type=Notification.FOR_TASK_REMINDER,
                )
            except Exception as e:
                print("[NOTIFY] Error while creating Notification:", e)

        print("[NOTIFY] Done.")
