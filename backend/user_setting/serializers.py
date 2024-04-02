from .models import UserSetting
from social.models import Emoji
from rest_framework import serializers

class UserSettingSerializer(serializers.ModelSerializer):
    favorite_emojis = serializers.PrimaryKeyRelatedField(many=True, queryset=Emoji.objects.all())
    dislikable_emojis = serializers.PrimaryKeyRelatedField(many=True, queryset=Emoji.objects.all())

    class Meta:
        model = UserSetting
        exclude = ["id", "user", "created_at", "updated_at", "deleted_at"]
