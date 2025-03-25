from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("", views.ProjectList.as_view()),
    path("inbox/", views.InboxDetail.as_view()),
    path("<str:id>/", views.ProjectDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
