from rest_framework import serializers
from .models import Announcement, Heart

class AnnouncementSerializer(serializers.ModelSerializer):
    hearts_count = serializers.SerializerMethodField()

    def get_hearts_count(self, obj):
        return Heart.objects.filter(announcement=obj).count()

    class Meta:
        model = Announcement
        fields = ("id", "created_at", "updated_at", "hearts_count", "lang", "title", "content", )
