from django.urls import path

from . import views

urlpatterns = [
    path("current_user", views.get_current_user),
    path("sign_in", views.sign_in),
    # path("sign_out/", views.sign_out),
    # path("sign_up/", views.sign_up),
    # path("users/@<str:username>/", views.users_all),
]