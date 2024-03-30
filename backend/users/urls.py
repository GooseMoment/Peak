from django.urls import path

from . import views
from user_setting.views import UserSettingDetail

urlpatterns = [
    path("users/me/", views.get_me),
    path("sign_in/", views.sign_in),
    path("sign_out/", views.sign_out),
    path("sign_up/", views.sign_up),
    path("users/@<str:username>/", views.UserDetail.as_view()),
    path("users/@<str:username>/setting/", UserSettingDetail.as_view())
]