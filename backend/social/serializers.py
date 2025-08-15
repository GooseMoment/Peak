from rest_framework import serializers

from .models import Emoji, Quote, Remark, Reaction, Peck, Comment, Following, Block
from users.serializers import UserSerializer
from tasks.serializers import TaskSerializer


class EmojiSerializer(serializers.ModelSerializer):
    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = Emoji
        fields = ["id", "name", "img"]


class QuoteSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = Quote
        fields = ["id", "user", "content", "date"]


class RemarkSerializer(serializers.ModelSerializer):
    user = UserSerializer(default=serializers.CurrentUserDefault())

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = Remark
        fields = [
            "id",
            "user",
            "content",
            "date",
            "created_at",
            "updated_at",
        ]


class StatSerializer(UserSerializer):
    completed_task_count = serializers.IntegerField()
    reaction_count = serializers.IntegerField()
    date = serializers.CharField()

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + [
            "completed_task_count",
            "reaction_count",
            "date",
        ]


class ReactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    emoji = EmojiSerializer(many=False, read_only=True)

    task = TaskSerializer()
    quote = QuoteSerializer()

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = Reaction
        fields = ["id", "user", "parent_type", "task", "quote", "emoji"]


class PeckSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    task = TaskSerializer()

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = Peck
        fields = ["id", "user", "task", "count"]


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    task = TaskSerializer()
    quote = QuoteSerializer()

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = Comment
        fields = ["id", "user", "parent_type", "task", "quote", "created_at", "comment"]


class FollowingSerializer(serializers.ModelSerializer):
    follower = UserSerializer(many=False, read_only=True)
    followee = UserSerializer(many=False, read_only=True)

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = Following
        fields = [
            "follower",
            "followee",
            "status",
            "created_at",
            "updated_at",
            "deleted_at",
        ]


class BlockSerializer(serializers.ModelSerializer):
    blocker = UserSerializer(many=False, read_only=True)
    blockee = UserSerializer(many=False, read_only=True)

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- ModelSerializer.Meta
        model = Block
        fields = ["blocker", "blockee", "deleted_at"]
