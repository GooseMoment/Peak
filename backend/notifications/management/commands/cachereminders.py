from django.core.management.base import BaseCommand, CommandError, CommandParser
from django.core.cache import cache

from notifications.models import TaskReminder
from datetime import datetime, UTC, timedelta

class Command(BaseCommand):
    help = "Get TaskReminders of the next minute and save in the cache."

    def add_arguments(self, parser: CommandParser):
        return super().add_arguments(parser)
    
    def handle(self, *args, **options):
        next_minute = datetime.now(UTC).replace(second=0, microsecond=0) + timedelta(minutes=1)
        next_minute_timestamp = next_minute.isoformat()
        key = "reminders_" + next_minute_timestamp

        reminders: list[TaskReminder] = list()
        
        query_set = TaskReminder.objects.filter(scheduled=next_minute).all()
        for reminder in query_set:
            reminders.append(reminder)
        
        if len(reminders) == 0:
            print("[CACHE] No TaskReminders.")
            return

        cache.set(key, reminders, 60 * 2)
        print(f"[CACHE] Cached {len(reminders)} TaskReminders.")
