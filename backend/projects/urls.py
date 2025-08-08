from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views
from drawers.views import InboxDetail

urlpatterns = [
    path("reorder/", views.ProjectReorderView.as_view()),
    path("", views.ProjectList.as_view()),
    path("inbox/", InboxDetail.as_view()),
    path("<str:id>/", views.ProjectDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
