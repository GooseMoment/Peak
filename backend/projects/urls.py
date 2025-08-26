from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("reorder/", views.ProjectReorderView.as_view()),
    path("", views.ProjectList.as_view()),
    path("inbox/", views.InboxProjectDetail.as_view()),
    path("<str:id>/", views.ProjectDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
