from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("", views.TaskList.as_view()),
    path("<str:id>", views.TaskDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
