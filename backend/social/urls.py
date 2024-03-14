from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('follow/<str:follower>/<str:followee>/', views.FollowView.as_view(), name='follow'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
