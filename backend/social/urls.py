from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    # explore
    path("explore/search/", views.ExploreSearchView.as_view()),
    path("explore/", views.ExploreFeedView.as_view()),
    # user list
    path(
        "followings/@<str:follower_username>/@<str:followee_username>/",
        views.FollowingView.as_view(),
        name="followings",
    ),
    path(
        "blocks/@<str:blocker_username>/@<str:blockee_username>/",
        views.BlockView.as_view(),
    ),
    # stats (replacing daily log preview)
    path(
        "stats/<str:date_iso>/",
        views.StatList.as_view(),
        name="stat-list",
    ),
    path(
        "stats/@<str:username>/<str:date_iso>/",
        views.StatDetail.as_view(),
        name="stat-detail",
    ),
    # records (replacing daily log detail)
    path(
        "records/@<str:username>/<str:date_iso>/",
        views.RecordDetail.as_view(),
        name="record-detail",
    ),
    # remarks (replacing daily log quote)
    path(
        "remarks/@<str:username>/<str:date_iso>/",
        views.RemarkDetail.as_view(),
        name="remark-detail",
    ),
    # interactions (reactions, comments, pecks)
    path("task_reactions/<str:reaction_id>/", views.TaskReactionDetail.as_view()),
    path("comments/<str:type>/<str:id>/", views.CommentView.as_view()),
    path("pecks/<str:id>/", views.PeckView.as_view()),
    path("emojis/", views.EmojiList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
