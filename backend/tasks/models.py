from django.db import models
from datetime import datetime, time
from pytz import timezone

from api.models import Base, PrivacyMixin
from users.models import User
from drawers.models import Drawer

class Repeat(Base):
    # TODO: 자연어로 빠른 Repeat 지정
    startedAt = models.DateTimeField()

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    
    weekdays = models.BinaryField(max_length=7, default=b'0000000')
    week_frequency = models.IntegerField(default=0)
    month = models.IntegerField(default=0)
    day = models.IntegerField(default=0)

    def __str__(self) -> str:
        return f"Repeat by {self.user}"
    
    class Meta:
        db_table = "repeats"

class Task(Base, PrivacyMixin):
    name = models.CharField(max_length=128)
    completed_at = models.DateTimeField(null=True, blank=True)
    drawer = models.ForeignKey(
        Drawer,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    due_date = models.DateField(null=True, blank=True)
    due_time = models.TimeField(null=True, blank=True)
    due_tz = models.CharField(max_length=128, null=True, blank=True)
    assigned_at = models.DateField(null=True, blank=True)
    priority = models.IntegerField(default=0)
    memo = models.TextField(null=True, blank=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tasks',
    )
    repeat = models.ForeignKey(
        Repeat,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def due_datetime(self):
        if (self.due_time == None):
            self.due_time = time(0, 0, 0)
        due = datetime.combine(self.due_date, self.due_time)
        tz = timezone("UTC")
        return tz.localize(due)

    def __str__(self) -> str:
        return f"{self.name} by {self.user}"
    
    class Meta:
        db_table = "tasks"
