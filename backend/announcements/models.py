from django.db import models

from api.models import Base
from users.models import User


class Announcement(Base):
    EN = "en"
    KO = "ko"

    LANGUAGE_CHOICES = [
        (EN, "English"),
        (KO, "Korean"),
    ]

    title = models.CharField(max_length=128)
    content_raw = models.TextField()
    content = models.TextField(editable=False)
    lang = models.CharField(max_length=128, choices=LANGUAGE_CHOICES)
    pinned_until = models.DateTimeField(blank=True, null=True)

    def __str__(self) -> str:
        return f"[{self.lang}] {self.title}"

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- Base.Meta
        db_table = "announcements"


class Heart(Base):
    announcement = models.ForeignKey(
        Announcement, on_delete=models.CASCADE, related_name="hearts"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="announcement_hearts"
    )

    def __str__(self) -> str:
        return f"{self.user} -> '{self.announcement}'"

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- Base.Meta
        db_table = "announcements_hearts"

        constraints = [
            models.UniqueConstraint(
                fields=["announcement", "user"], name="constraint_announcement_user"
            ),
        ]
