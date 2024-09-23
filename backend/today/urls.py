from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("assignment", views.TodayAssignmentTaskList.as_view()),
    path("due", views.TodayDueTaskList.as_view()),
    path("overdue", views.OverdueTaskList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
