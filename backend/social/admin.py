from django.contrib import admin
from .models import (
    Emoji,
    Peck,
    Quote,
    Remark,
    Reaction,
    ReactionTask,
    Comment,
    Following,
    Block,
)
from api.admin import fieldset_base, readonly_fields_base


@admin.register(Emoji)
class EmojiAdmin(admin.ModelAdmin):
    ordering = [
        "name",
    ]
    search_fields = ["name"]
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["name", "img"],
            },
        ),
        fieldset_base,
    ]


@admin.register(Peck)
class PeckAdmin(admin.ModelAdmin):
    ordering = ["-updated_at"]
    search_fields = ["user__username", "task"]
    autocomplete_fields = ["user", "task"]
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["user", "task", "count"],
            },
        ),
        fieldset_base,
    ]


@admin.register(Remark)
class RemarkAdmin(admin.ModelAdmin):
    ordering = ["-date", "updated_at"]
    search_fields = ["user__username", "date"]
    autocomplete_fields = ["user"]
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["user", "content", "date"],
            },
        ),
        fieldset_base,
    ]


@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    ordering = ["-date", "updated_at"]
    search_fields = ["user__username", "date"]
    autocomplete_fields = ["user"]
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["user", "content", "date"],
            },
        ),
        fieldset_base,
    ]


@admin.register(Reaction)
class ReactionAdmin(admin.ModelAdmin):
    ordering = ["-updated_at"]
    search_fields = ["user__username", "emoji"]
    autocomplete_fields = ["user", "task", "quote", "emoji"]
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["user", "parent_type", "emoji"],
            },
        ),
        (
            "Payloads",
            {
                "fields": ["task", "quote"],
            },
        ),
        fieldset_base,
    ]


@admin.register(ReactionTask)
class ReactionTaskAdmin(admin.ModelAdmin):
    ordering = ["-updated_at"]
    search_fields = ["user__username", "task__id", "image_emoji", "unicode_emoji"]
    autocomplete_fields = ["user", "task", "image_emoji"]
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["user", "task", "image_emoji", "unicode_emoji"],
            },
        ),
        fieldset_base,
    ]


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    ordering = ["-updated_at"]
    search_fields = ["user__username", "task"]
    autocomplete_fields = ["user", "task", "quote"]
    readonly_fields = readonly_fields_base
    fieldsets = [
        (
            None,
            {
                "fields": ["user", "parent_type", "comment"],
            },
        ),
        (
            "Payloads",
            {
                "fields": ["task", "quote"],
            },
        ),
        fieldset_base,
    ]


@admin.register(Following)
class FollowingAdmin(admin.ModelAdmin):
    ordering = ["-updated_at"]
    search_fields = ["followee__username", "follower__username"]
    autocomplete_fields = ["follower", "followee"]
    readonly_fields = (
        "created_at",
        "updated_at",
        "deleted_at",
    )
    fieldsets = [
        (
            None,
            {
                "fields": ["follower", "followee", "status"],
            },
        ),
        (
            "CUD",
            {
                "classes": ["collapse"],
                "fields": ["created_at", "updated_at", "deleted_at"],
            },
        ),
    ]


@admin.register(Block)
class BlockAdmin(admin.ModelAdmin):
    ordering = ["-updated_at"]
    search_fields = ["blockee__username", "blocker__username"]
    autocomplete_fields = ["blocker", "blockee"]
    readonly_fields = (
        "created_at",
        "updated_at",
        "deleted_at",
    )
    fieldsets = [
        (
            None,
            {
                "fields": ["blocker", "blockee"],
            },
        ),
        (
            "CUD",
            {
                "classes": ["collapse"],
                "fields": ["created_at", "updated_at", "deleted_at"],
            },
        ),
    ]
