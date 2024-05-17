from rest_framework import serializers

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

class DailyReportSerializer(UserSerializer):
    recent_task = serializers.SerializerMethodField()
    
    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ['recent_task']
    
    def get_recent_task(self, obj):
        day_min = self.context.get('day_min', None)
        day_max = self.context.get('day_max', None)
        
        recent_task = obj.tasks.filter(
            completed_at__range=(day_min, day_max)
        ).all().order_by("-completed_at").first()
        
        return TaskSerializer(recent_task).data if recent_task else None
        

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