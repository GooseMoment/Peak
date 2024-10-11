from django.urls import path

from . import views
from user_setting.views import UserSettingDetail
from projects.views import UserProjectList
from social import views as social_views
from knox import views as knox_views

urlpatterns = [
    path("users/me/", views.get_me),
    path("users/me/setting/", UserSettingDetail.as_view()),
    path("users/me/password/", views.patch_password),
    path("users/me/profile_img/", views.upload_profile_img),
    path("password_recovery/", views.PasswordRecoveryView.as_view()),
    path("sign_in/", views.SignInView.as_view(), name="knox_login"),
    path("sign_out/", knox_views.LogoutView.as_view(), name="knox_logout"),
    path("sign_out_all/", knox_views.LogoutAllView.as_view(), name="knox_logoutall"),
    path("sign_up/", views.sign_up),
    path("sign_up/verification/", views.VerifyEmailVerificationToken.as_view()),
    path("sign_up/verification/resend/", views.ResendEmailVerificationMail.as_view()),
    path("users/@<str:username>/", views.UserDetail.as_view()),
    path("users/@<str:username>/followers/", social_views.UserFollowerList.as_view()),
    path("users/@<str:username>/followings/", social_views.UserFollowingList.as_view()),
    path("users/@<str:username>/requesters/", social_views.UserFollowRequesterList.as_view()),
    path("users/@<str:username>/blocks/", social_views.BlockList.as_view()),
    path("users/@<str:username>/projects/", UserProjectList.as_view()),
]
