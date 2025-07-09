from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from django.contrib.admin.options import _FieldOpts


fieldset_base: tuple[str, "_FieldOpts"] = (
    "ID & CUD (Base)",
    {
        "classes": ["collapse"],
        "fields": ["id", "created_at", "updated_at", "deleted_at"],
    },
)

readonly_fields_base = (
    "id",
    "created_at",
    "updated_at",
)
