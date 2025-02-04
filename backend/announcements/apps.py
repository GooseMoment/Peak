from django.apps import AppConfig


class AnnouncementsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "announcements"

    def ready(self) -> None:
        from . import signals  # noqa: F401 -- signals is required

        return super().ready()
