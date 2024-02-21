from django.urls import path

from . import views

urlpatterns = [
    path("", views.get_notifications),
    path("<str:id>", views.NotificationView.as_view()),
]
