from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('follow/@<str:follower>/@<str:followee>/', views.FollowView.as_view()),
    path('block/@<str:blocker>/@<str:blockee>/', views.BlockView.as_view()),
    path('daily/logs/@<str:username>/<str:day>/', views.get_daily_logs),
    path('daily/log/@<str:follower>/@<str:followee>/<str:day>/', views.view_daily_log),
    path('emojis/', views.EmojiList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
