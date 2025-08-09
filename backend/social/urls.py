from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("explore/search/", views.ExploreSearchView.as_view()),
    path("explore/", views.ExploreFeedView.as_view()),
    path(
        "followings/@<str:follower_username>/@<str:followee_username>/",
        views.FollowingView.as_view(),
        name="followings",
    ),
    path(
        "blocks/@<str:blocker_username>/@<str:blockee_username>/",
        views.BlockView.as_view(),
    ),
    path("daily/logs/@<str:username>/<str:day>/", views.get_daily_logs),
    path(
        "daily/log/details/@<str:followee>/<str:day>/",
        views.DailyLogDetailsView.as_view(),
    ),
    path(
        "daily/log/details/drawer/@<str:followee>/", views.DailyLogDrawerView.as_view()
    ),
    path(
        "daily/log/details/task/<str:drawer>/<str:day>/",
        views.DailyLogTaskView.as_view(),
    ),
    path(
        "stats/<str:date_iso>/",
        views.StatList.as_view(),
        name="stats",
    ),
    path(
        "stats/<str:date_iso>/@<str:username>/",
        views.StatDetail.as_view(),
        name="stat-detail",
    ),
    path("records/@<str:username>/<str:date_iso>/", views.RecordView.as_view()),
    path("quotes/@<str:followee>/<str:day>/", views.get_quote),
    path("quotes/<str:day>/", views.post_quote),
    path("remarks/@<str:username>/<str:date_iso>/", views.RemarkDetail.as_view()),
    path("reactions/<str:type>/<str:id>/", views.ReactionView.as_view()),
    path("comments/<str:type>/<str:id>/", views.CommentView.as_view()),
    path("pecks/<str:id>/", views.PeckView.as_view()),
    path("emojis/", views.EmojiList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
