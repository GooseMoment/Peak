from rest_framework import serializers

from django.utils import timezone
from django.core.cache import cache
from django.db.models import Q

from datetime import datetime

from .models import *
from projects.models import Project
from tasks.models import Task

from users.serializers import UserSerializer
from tasks.serializers import TaskSerializer
from drawers.serializers import DrawerSerializer

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
        fields = UserSerializer.Meta.fields + ["recent_task"]
        
    def get_recent_task(self, obj):
        day_min = self.context.get("day_min", None)
        day_max = self.context.get("day_max", None)
                
        recent_task = obj.tasks.filter(
            completed_at__range=(day_min, day_max)
        ).all().order_by("-completed_at").first()
        
        if not recent_task:
            return None
        
        followee_user_id = obj.id
        day = day_min.isoformat()
        
        cache_key = f"user_id_{followee_user_id}_date_{day}"
        cache_data = cache.get(cache_key)
        
        is_read = True
        if cache_data:
            # last_visted = timezone.make_aware()
            last_visted = cache_data[self.context.get("user_id", None)]
            is_read = last_visted > recent_task.completed_at
        
        #need to delete
        is_read = False
        
        recent_task = TaskSerializer(recent_task).data
        recent_task["is_read"] = is_read
        recent_task["project_color"] = Project.objects.get(id=recent_task["project_id"]).color
        
        return recent_task
    
    # for sort in backend
    # def to_representation(self, instance):
    #     ret = super().to_representation(instance)
        
    #     if 'recent_task' in ret:
    #         ret['recent_task'] = sorted(ret['recent_task'], key=lambda x: x['recent_task__completed_at'])
    #     return ret

class DailyCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    
    class Meta:
        model = DailyComment
        fields = ["id", "user", "comment", "date"]
    # def to_representation(self, instance):
    #     data = super().to_representation(instance)
        
    #     if not instance.comment:
    #         return {'user': data['user']}
        
    #     return data

class DailyLogDetailsSerializer(DrawerSerializer):
    color = serializers.CharField(read_only=True)
    tasks = TaskSerializer(many=True, read_only=True)
    
    class Meta(DrawerSerializer.Meta):
        fields = DrawerSerializer.Meta.fields + ['color', 'tasks']
        
    def get_color(self, obj):
        return obj['color']

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
    task = TaskSerializer()
    
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