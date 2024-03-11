from django.db import models

from api.models import Base
from projects.models import Project

class Drawer(Base):
    name = models.CharField(max_length=128)
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="drawers",
    )
    order = models.IntegerField()
    privacy = models.CharField(max_length=128)
    uncompleted_task_count = models.IntegerField()
    completed_task_count = models.IntegerField()