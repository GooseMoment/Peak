from django.db import models

from api.models import Base
from users.models import User

class Announcement(Base):
    title = models.CharField(max_length=128)
    content = models.TextField()

    def __str__(self) -> str:
        return self.title

    class Meta:
        db_table = "announcements"


class Heart(Base):
    announcement = models.ForeignKey(Announcement, on_delete=models.CASCADE, related_name="hearts")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="announcement_hearts")

    def __str__(self) -> str:
        return f"{self.user} -> '{self.announcement}'"

    class Meta:
        db_table = "announcements_hearts"

        constraints = [
            models.UniqueConstraint(fields=["announcement", "user"], name="constraint_announcement_user"),
        ]
