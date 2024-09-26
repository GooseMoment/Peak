from django.urls import path

from . import views
from user_setting.views import UserSettingDetail
from projects.views import UserProjectList
from social.views import get_followers, get_followings, get_blocks, get_requesters

urlpatterns = [
    path("me/", views.get_me),
    path("me/setting/", UserSettingDetail.as_view()),
    path("me/password/", views.patch_password),
    path("me/profile_img/", views.upload_profile_img),
    path("me/blocks/", views.get_my_blocks),
    path("@<str:username>/", views.UserDetail.as_view()),
    path("@<str:username>/followers/", get_followers),
    path("@<str:username>/followings/", get_followings),
    path("@<str:username>/requesters/", get_requesters),
    path("@<str:username>/blocks/", get_blocks),
    path("@<str:username>/projects/", UserProjectList.as_view()),
]
