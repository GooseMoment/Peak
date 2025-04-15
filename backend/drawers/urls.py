from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("reorder/", views.DrawerReorderView.as_view()),
    path("", views.DrawerList.as_view()),
    path("<str:id>/", views.DrawerDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
