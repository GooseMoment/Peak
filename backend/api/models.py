from django.db import models

import uuid

class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=18, unique=True)
    display_name = models.CharField(max_length=18)
    password = models.TextField()
    email = models.EmailField()
    followings_count = models.IntegerField()
    followers_count = models.IntegerField()
    profile_img_uri = models.URLField() # TODO: default profile img
    bio = models.TextField(max_length=50)

class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField()
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    order = models.IntegerField()
    color = models.CharField(max_length=6)
    type = models.CharField()

class Drawer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField()
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
    )
    order = models.IntegerField()
    privacy = models.CharField()
    uncompleted_task_count = models.IntegerField()
    completed_task_count = models.IntegerField()


class Repeat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # TODO: 자연어로 빠른 Repeat 지정
    startedAt = models.DateTimeField()

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    
    weekdays = models.BinaryField(max_length=7, default=b'0000000')
    week_frequency = models.IntegerField(default=0)
    month = models.IntegerField(default=0)
    day = models.IntegerField(default=0)

class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField()
    privacy = models.CharField()
    completed_at = models.DateTimeField()
    drawer = models.ForeignKey(
        Drawer,
        on_delete=models.CASCADE,
    )
    due_date = models.DateField()
    due_time = models.TimeField()
    priority = models.IntegerField()
    memo = models.TextField()
    reminder_datetime = models.DateTimeField()

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    repeat = models.ForeignKey(
        Repeat
    )

class Emoji(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=)
    img_uri = models.URLField()

class Peck(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
    )
    count = models.IntegerField()

class DailyComment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    comment = models.TextField()
    date = models.DateField()

class Reaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    parent_type = models.CharField()
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
    )
    daily_comment = models.ForeignKey(
        DailyComment,
        on_delete=models.CASCADE,
    )
    emoji = models.ManyToManyField(Emoji)

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
    )
    comment = models.TextField()

class UserSetting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    follow_request_approval_manually = models.BooleanField(default=False)
    # TODO: 만들고 추가하세요 구영서씨

class Following(models.Model):
    # 보내는사람
    follower = models.OneToOneField(
        User,
        on_delete = models.CASCADE,
    )
    # 받는사람
    followee = models.OneToOneField(
        User,
        on_delete = models.CASCADE,
    )
    # 요청인가
    is_request = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["follower", "followee"], name="constraint_follower_followee"),
        ]

class Block(models.Model):
    blocker = models.OneToOneField(
        User,
        on_delete = models.CASCADE,
    )
    blockee = models.OneToOneField(
        User,
        on_delete = models.CASCADE,
    )

class TaskReminder(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    task = models.ForeignKey(
        Task,
        on_delete = models.CASCADE,
    )
    scheduled = models.DateTimeField()

class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField()
    user = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
    )
    task = models.ForeignKey(
        Task,
        on_delete = models.CASCADE,
    )
    reaction = models.ForeignKey(
        Reaction,
        on_delete = models.CASCADE,
    )
    follow_request = models.ForeignKey(
        Following,
        on_delete = models.CASCADE,
    )
    deleted_at = models.DateTimeField()
    updated_at = models.DateTimeField()