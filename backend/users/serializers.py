from rest_framework import serializers

from .models import User

class UserSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField(read_only=True)
    is_me = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "username", "display_name", "followings_count", "followers_count",
            "profile_img_uri", "bio", "email", "is_me",
        ]

    def get_email(self, obj):
        if self.context.get("is_me", False):
            return obj.email
        
        return "secret@of.course"
    
    def get_is_me(self, obj):
        return self.context.get("is_me", False)