from django.contrib import admin
from .models import Emoji, Peck, DailyComment, Reaction, Comment, Following, Block

@admin.register(Emoji)
class EmojiAdmin(admin.ModelAdmin):
    pass

@admin.register(Peck)
class PeckAdmin(admin.ModelAdmin):
    pass

@admin.register(DailyComment)
class DailyCommentAdmin(admin.ModelAdmin):
    pass

@admin.register(Reaction)
class ReactionAdmin(admin.ModelAdmin):
    pass

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass

@admin.register(Following)
class FollowingAdmin(admin.ModelAdmin):
    pass

@admin.register(Block)
class BlockAdmin(admin.ModelAdmin):
    pass