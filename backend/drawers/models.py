from django.db import models

from api.models import Base
from projects.models import Project
from users.models import User

class Drawer(Base):
    name = models.CharField(max_length=128)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="drawers",
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="drawers",
    )
    order = models.IntegerField()
    privacy = models.CharField(max_length=128)
    uncompleted_task_count = models.IntegerField()
    completed_task_count = models.IntegerField()

    def __str__(self) -> str:
        return f"{self.name} by {self.user}"