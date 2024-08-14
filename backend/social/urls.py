from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('explore/search/', views.ExploreSearchView.as_view()),
    path('explore/', views.ExploreFeedView.as_view()),
    path('follow/@<str:follower>/@<str:followee>/', views.FollowView.as_view()),
    path('block/@<str:blocker>/@<str:blockee>/', views.BlockView.as_view()),
    path('daily/logs/@<str:username>/<str:day>/', views.get_daily_logs),
    path('daily/quote/@<str:followee>/<str:day>/', views.get_quote),
    path('daily/quote/<str:day>/', views.post_quote),
    path('daily/log/details/drawer/@<str:followee>/', views.DailyLogDrawerView.as_view()),
    path('daily/log/details/task/<str:drawer>/<str:day>/', views.DailyLogTaskView.as_view()),
    path('reaction/<str:type>/<str:id>/', views.ReactionView.as_view()),
    path('comment/<str:type>/<str:id>/', views.CommentView.as_view()),
    path('peck/<str:id>/', views.PeckView.as_view()),
    path('emojis/', views.EmojiList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
