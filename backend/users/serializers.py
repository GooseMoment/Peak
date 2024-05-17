from django.conf import settings
from rest_framework import serializers

from .models import User

class DefaultImageField(serializers.ImageField):
    def to_representation(self, value):
        if not value:
            return settings.USER_DEFAULT_PROFILE_IMG
        
        return super().to_representation(value)

class UserSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField(read_only=True)
    is_me = serializers.SerializerMethodField(read_only=True)
    profile_img = DefaultImageField(read_only=True)

    class Meta:
        model = User
        fields = [
            "username", "display_name", "followings_count", "followers_count",
            "profile_img", "bio", "email", "is_me",
        ]

    def get_email(self, obj):
        if self.context.get("is_me", False):
            return obj.email
        
        return "secret@of.course"
    
    def get_is_me(self, obj):
        return self.context.get("is_me", False)
    