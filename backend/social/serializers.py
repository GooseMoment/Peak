from rest_framework import serializers

from django.utils import timezone
from django.core.cache import cache

from datetime import datetime

from .models import *

from users.serializers import UserSerializer
from tasks.serializers import TaskSerializer

class EmojiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emoji
        fields = ["id", "name", "img_uri"]

class PeckSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    task = TaskSerializer()
    
    class Meta:
        model = Peck
        fields = ["id", "user", "task", "count"]

class DailyLogsSerializer(UserSerializer):
    recent_task = serializers.SerializerMethodField()
    
    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ['recent_task']
    
    def get_recent_task(self, obj):
        day_min = timezone.make_aware(self.context.get('day_min', None))
        day_max = timezone.make_aware(self.context.get('day_max', None))
                
        recent_task = obj.tasks.filter(
            completed_at__range=(day_min, day_max)
        ).all().order_by("-completed_at").first()
        
        if not recent_task:
            return None
        
        followee_user_id = obj.id
        day = day_min.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3]+'Z'
        cache_key = f"user_id_{followee_user_id}_date_{day}"
        cache_data = cache.get(cache_key)
        
        is_read = True
        if cache_data:
            last_visted = timezone.make_aware(cache_data[self.context.get('user_id', None)])
            is_read = last_visted > recent_task.completed_at
        
        recent_task = TaskSerializer(recent_task).data
        recent_task['is_read'] = is_read
        
        return recent_task

class DailyCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    
    class Meta:
        model = DailyComment
        fields = ["id", "user", "comment", "date"]

class ReactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    emoji = EmojiSerializer(many=False, read_only=True)

    task = TaskSerializer()
    daily_comment = DailyCommentSerializer()
    
    class Meta:
        model = Reaction
        fields = ["id", "user", "parent_type", "task", "daily_comment", "emoji"]
        
class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    #TODO TaskSerializer
    
    class Meta:
        model = Comment
        fields = ["id", "user", "task", "comment"]

class FollowingSerializer(serializers.ModelSerializer):
    follower = UserSerializer(many=False, read_only=True)
    followee = UserSerializer(many=False, read_only=True)
    
    class Meta:
        model = Following
        fields = ["follower", "followee", "status", "created_at", "updated_at", "deleted_at"]

class BlockSerializer(serializers.ModelSerializer):
    blocker = UserSerializer(many=False, read_only=True)
    blockee = UserSerializer(many=False, read_only=True)
    
    class Meta:
        model = Block
        fields = ["blocker", "blockee", "deleted_at"]