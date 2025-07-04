from django.db import models

import uuid


class Base(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True


class PrivacyMixin(
    models.Model
):  # inheriting models.Model is required to make the `privacy` field JSON serializable
    FOR_PUBLIC = "public"
    FOR_PROTECTED = "protected"  # followers only
    FOR_PRIVATE = "private"  # me

    PRIVACY_TYPES = [
        (FOR_PUBLIC, "for public"),
        (FOR_PROTECTED, "for protected"),
        (FOR_PRIVATE, "for private"),
    ]

    privacy = models.CharField(choices=PRIVACY_TYPES, max_length=128)

    class Meta:
        abstract = True
