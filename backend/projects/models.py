from django.db import models

from api.models import Base
from users.models import User

class Project(Base):
    REGULAR = "regular"
    GOAL = "goal"

    PROJECT_TYPE_CHOICES = [
        (REGULAR, "Regular"),
        (GOAL, "Goal"),
    ]

    name = models.CharField(max_length=128)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    order = models.IntegerField()
    color = models.CharField(max_length=6)
    type = models.CharField(choices=PROJECT_TYPE_CHOICES, max_length=128)

    def __str__(self) -> str:
        return f"{self.name} by {self.user}"