from django.apps import AppConfig


class DrawersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'drawers'

    def ready(self):
        from . import signals

        return super().ready()
