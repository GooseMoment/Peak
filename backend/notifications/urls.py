from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("", views.NotificationList.as_view()),
    path("subscribe", views.WebPushSubscribe.as_view()),
    path("<str:id>", views.NotificationDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
