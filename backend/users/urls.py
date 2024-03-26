from django.urls import path

from . import views
from social.views import get_followers

urlpatterns = [
    path("current_user/", views.get_current_user),
    path("sign_in/", views.sign_in),
    path("sign_out/", views.sign_out),
    path("sign_up/", views.sign_up),
    path("users/@<str:username>/", views.UserDetail.as_view()),
    path("users/@<str:username>/followers/", get_followers),
]