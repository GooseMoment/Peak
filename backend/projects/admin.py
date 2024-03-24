from django.contrib import admin
from .models import Project
from api.admin import fieldset_base, readonly_fields_base

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["user", "name", "order", "color", "type"],
            },
        ),
        fieldset_base,
    ]