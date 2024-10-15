from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("assigned", views.TaskTodayAssignedList.as_view()),
    path("assigned/grouped", views.TaskTodayAssignedGrouped.as_view()),
    path("due", views.TaskTodayDueList.as_view()),
    path("overdue", views.TaskOverdueList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
