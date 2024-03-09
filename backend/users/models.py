from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager

import uuid

class UserManager(BaseUserManager):
    def create_user(self, display_name, username, email, password=None):
        user = User(display_name=display_name, username=username, email=email)
        user.set_password(password)
        user.save()

    def create_superuser(self, display_name, username, email, password=None):
        # TODO: set is_staff
        self.create_user(display_name, username, email, password)

class User(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=18, unique=True)
    display_name = models.CharField(max_length=18, blank=True)
    password = models.TextField()
    email = models.EmailField(unique=True)
    followings_count = models.IntegerField(default=0)
    followers_count = models.IntegerField(default=0)
    profile_img_uri = models.URLField() # TODO: default profile img
    bio = models.TextField(max_length=50, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, default=None)

    # ---

    # fields to substitute default Django's User
    # see also: https://docs.djangoproject.com/en/5.0/topics/auth/customizing/#specifying-a-custom-user-model

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["display_name", "password", "email"]

    is_active = models.BooleanField(default=True)

    def get_full_name(self):
        return self.id + "|@" + self.username
    
    def get_short_name(self):
        return "@" + self.username
    
    objects = UserManager()

    class Meta:
        abstract = False