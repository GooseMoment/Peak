from django.db import models

from api.models import Base, PrivacyMixin
from users.models import User
from drawers.models import Drawer


class Task(Base, PrivacyMixin):
    DUE_DATE = "due_date"
    DUE_DATETIME = "due_datetime"

    TASK_DUE_TYPE_CHOICES = [
        (DUE_DATE, "due_date"),
        (DUE_DATETIME, "due_datetime"),
    ]

    name = models.CharField(max_length=128)
    completed_at = models.DateTimeField(null=True, blank=True)
    drawer = models.ForeignKey(Drawer, on_delete=models.CASCADE, related_name="tasks")
    due_type = models.CharField(
        choices=TASK_DUE_TYPE_CHOICES, max_length=12, null=True, blank=True
    )
    due_date = models.DateField(null=True, blank=True)
    due_datetime = models.DateTimeField(null=True, blank=True)
    assigned_at = models.DateField(null=True, blank=True)
    priority = models.IntegerField(default=0)
    memo = models.TextField(null=True, blank=True)
    order = models.IntegerField(default=0)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="tasks",
    )

    def __str__(self) -> str:
        return f"{self.name} by {self.user}"

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- Base.Meta, PrivacyMixin.Meta
        db_table = "tasks"
