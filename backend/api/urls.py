from django.urls import path

from . import views

urlpatterns = [
    path("ok/", views.get_healthcheck),
]
