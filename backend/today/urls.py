from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("assigned", views.TaskTodayAssignedList.as_view()),
    path("todayDue", views.TodayDueTaskList.as_view()),
    path("overDue", views.OverDueTaskList.as_view()),
    path("pastAssigned", views.PastAssignedTaskList.as_view()),
    path("assigned/grouped", views.TaskTodayAssignedGrouped.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
