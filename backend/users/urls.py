from django.urls import path

from . import views
from social.views import get_followers, get_followings, get_blocks

urlpatterns = [
    path("users/me/", views.get_me),
    path("sign_in/", views.sign_in),
    path("sign_out/", views.sign_out),
    path("sign_up/", views.sign_up),
    path("users/@<str:username>/", views.UserDetail.as_view()),
    path("users/@<str:username>/followers/", get_followers),
    path("users/@<str:username>/followings/", get_followings),
    path("users/@<str:username>/blocks/", get_blocks),
]