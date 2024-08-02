from django.urls import path

from . import views
from user_setting.views import UserSettingDetail
from projects.views import UserProjectList
from social.views import get_followers, get_followings, get_blocks
from knox import views as knox_views

urlpatterns = [
    path("users/me/", views.get_me),
    path("users/me/setting/", UserSettingDetail.as_view()),
    path("users/me/password/", views.patch_password),
    path("users/me/profile_img/", views.upload_profile_img),
    path("users/me/blocks/", views.get_my_blocks),
    path("sign_in/", views.SignInView.as_view(), name="knox_login"),
    path("sign_out/", knox_views.LogoutView.as_view(), name="knox_logout"),
    path("sign_out_all/", knox_views.LogoutAllView.as_view(), name="knox_logoutall"),
    path("sign_up/", views.sign_up),
    path("sign_up/verification/", views.verify_email_verification_token),
    path("users/@<str:username>/", views.UserDetail.as_view()),
    path("users/@<str:username>/followers/", get_followers),
    path("users/@<str:username>/followings/", get_followings),
    path("users/@<str:username>/blocks/", get_blocks),
    path("users/@<str:username>/projects/", UserProjectList.as_view()),
]
