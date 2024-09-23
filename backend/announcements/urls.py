from django.urls import path

from . import views

urlpatterns = [
    path("", views.AnnouncementList.as_view()),
]
