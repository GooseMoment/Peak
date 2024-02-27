from rest_framework import serializers
from rest_framework.fields import empty

from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", "username", "display_name", "followings_count", "followers_count",
            "profile_img_uri", "bio"
        ]

    def __init__(self, instance=None, personal=False, data=empty, **kwargs):
        if personal:
            self.Meta.fields.append("email")

        super().__init__(instance, data, **kwargs)