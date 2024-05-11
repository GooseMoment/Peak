from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('follow/@<str:follower>/@<str:followee>/', views.FollowView.as_view()),
    path('block/@<str:blocker>/@<str:blockee>/', views.BlockView.as_view()),
    path('daily/report/@<str:username>/<str:day>/', views.get_daily_report),
    path('daily/report/@<str:follower>/@<str:followee>/<str:day>/', views.view_daily_report),
]

urlpatterns = format_suffix_patterns(urlpatterns)
