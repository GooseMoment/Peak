from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin

from api.models import Base

import uuid
import os
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from django.db.models.manager import RelatedManager
    from tasks.models import Task
    from social.models import Reaction


class UserManager(BaseUserManager):
    def create_user(self, display_name, username, email, password=None):
        user = User(display_name=display_name, username=username, email=email)
        user.set_password(password)
        user.save()

    def create_superuser(self, display_name, username, email, password=None):
        user = User(display_name=display_name, username=username, email=email)
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save()


# from: https://stackoverflow.com/a/2677474
def get_file_path(instance, filename):
    ext = filename.split(".")[-1]
    filename = "%s.%s" % (uuid.uuid4(), ext)
    return os.path.join("user_profile_imgs", filename)


class User(AbstractBaseUser, Base, PermissionsMixin):
    username = models.CharField(max_length=18, unique=True)
    display_name = models.CharField(max_length=18, null=True, blank=True)
    password = models.TextField()
    email = models.EmailField(unique=True)
    followings_count = models.IntegerField(default=0)
    followers_count = models.IntegerField(default=0)
    profile_img = models.ImageField(
        upload_to=get_file_path,
        null=True,
        blank=True,
    )
    bio = models.TextField(max_length=150, null=True, blank=True)
    header_color = models.CharField(max_length=128, default="grey")

    is_staff = models.BooleanField(default=False)

    # ---

    # fields to substitute default Django's User
    # see also: https://docs.djangoproject.com/en/5.0/topics/auth/customizing/#specifying-a-custom-user-model

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["display_name", "password", "email"]

    is_active = models.BooleanField(default=False)

    tasks: "RelatedManager[Task]"
    reactions: "RelatedManager[Reaction]"

    def get_full_name(self):
        return str(self.id) + "|@" + self.username

    def get_short_name(self):
        return "@" + self.username

    objects = UserManager()

    def __str__(self) -> str:
        return f"@{self.username}"

    class Meta:  # pyright: ignore [reportIncompatibleVariableOverride] -- Base.Meta
        db_table = "users"
