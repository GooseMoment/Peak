from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("", views.NotificationList.as_view()),
    path("subscribe/", views.WebPushSubscriptionCreate.as_view()),
    path("subscribe/<str:id>/", views.WebPushSubscriptionDetail.as_view()),
    path("reminders/", views.ReminderList.as_view()),
    path("reminders/<str:id>/", views.ReminderDetail.as_view()),
    path("<str:id>/", views.NotificationDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
