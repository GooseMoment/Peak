from django.urls import path

from . import views
from user_setting.views import UserSettingDetail
from projects.views import UserProjectList
from social import views as social_views

urlpatterns = [
    path("me/", views.get_me),
    path("me/setting/", UserSettingDetail.as_view()),
    path("me/password/", views.patch_password),
    path("me/profile_img/", views.upload_profile_img),
    path("@<str:username>/", views.UserDetail.as_view()),
    path("@<str:username>/followers/", social_views.FollowerList.as_view()),
    path("@<str:username>/followings/", social_views.FollowingList.as_view()),
    path("@<str:username>/requesters/", social_views.FollowRequesterList.as_view()),
    path("@<str:username>/blocks/", social_views.BlockList.as_view()),
    path("@<str:username>/projects/", UserProjectList.as_view()),
]
