from django.db import models

from api.models import Base, PrivacyMixin
from users.models import User
from django.db.models import Q, UniqueConstraint

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from django.db.models.manager import RelatedManager
    from drawers.models import Drawer


class Project(Base, PrivacyMixin):
    INBOX = "inbox"
    REGULAR = "regular"
    GOAL = "goal"

    PROJECT_TYPE_CHOICES = [
        (INBOX, "Inbox"),
        (REGULAR, "Regular"),
        (GOAL, "Goal"),
    ]

    name = models.CharField(max_length=128)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="projects",
    )
    order = models.IntegerField(default=0)
    color = models.CharField(max_length=128)
    type = models.CharField(choices=PROJECT_TYPE_CHOICES, max_length=128)

    drawers: "RelatedManager[Drawer]"

    def __str__(self) -> str:
        return f"{self.name} by {self.user}"

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- Base.Meta, PrivacyMixin.Meta
        db_table = "projects"

        constraints = [
            UniqueConstraint(
                fields=["name", "user"],
                name="constraint_project_name_active",
            ),
        ]
