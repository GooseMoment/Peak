from django.db import models

from api.models import Base, PrivacyMixin
from projects.models import Project
from users.models import User

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from django.db.models.manager import RelatedManager
    from tasks.models import Task


class Drawer(Base, PrivacyMixin):
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
    uncompleted_task_count = models.IntegerField(default=0)
    completed_task_count = models.IntegerField(default=0)

    tasks: "RelatedManager[Task]"

    def __str__(self) -> str:
        return f"{self.name} in {self.project}"

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- Base.Meta, PrivacyMixin.Meta
        db_table = "drawers"

        constraints = [
            models.UniqueConstraint(
                fields=["name", "project", "user"], name="constraint_drawer_name"
            ),
        ]
