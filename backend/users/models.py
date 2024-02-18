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