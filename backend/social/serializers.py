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
    #TODO TaskSerializer
    
    class Meta:
        model = Peck
        fields = ["id", "user", "task", "count"]

class DailyReportSerializer(serializers.Serializer):
    task = TaskSerializer()

class DailyCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    
    class Meta:
        model = DailyComment
        fields = ["id", "user", "comment", "date"]

class ReactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    emoji = EmojiSerializer(many=False, read_only=True)
    
    class Meta:
        model = Reaction
        fields = ["id", "user", "parent_type", "task", "daily_comment", "emoji"]
        #task와 daily_comment는 id로
        
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
        fields = ["follower", "followee", "is_request", "created_at", "updated_at", "deleted_at"]

class BlockSerializer(serializers.ModelSerializer):
    blocker = UserSerializer(many=False, read_only=True)
    blockee = UserSerializer(many=False, read_only=True)
    
    class Meta:
        model = Block
        fields = ["blocker", "blockee", "deleted_at"]