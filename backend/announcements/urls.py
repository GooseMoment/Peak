from django.urls import path

from . import views

urlpatterns = [
    path("", views.AnnouncementList.as_view()),
    path("<str:announcement_id>/hearts/@<str:username>/", views.HeartDetail.as_view()),
]
