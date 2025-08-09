from rest_framework import status, mixins, generics
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination, CursorPagination
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound

from django.shortcuts import get_object_or_404
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.db.models import Q, F, Count, Value
from django.db.models.query import QuerySet
from django.db.utils import IntegrityError
from django.utils import timezone

from .models import Emoji, Quote, Remark, Reaction, Peck, Comment, Following, Block
from .serializers import (
    EmojiSerializer,
    DailyLogsSerializer,
    DailyLogDrawerSerializer,
    DailyLogDetailsSerializer,
    StatSerializer,
    QuoteSerializer,
    RemarkSerializer,
    ReactionSerializer,
    PeckSerializer,
    CommentSerializer,
    FollowingSerializer,
    BlockSerializer,
)
from . import permissions, exceptions
from api.models import PrivacyMixin
from api.request import AuthenticatedRequest
from api.permissions import IsUserSelfRequest
from api.exceptions import RequiredFieldMissing
from api.mixins import TimezoneMixin
from drawers.models import Drawer
from tasks.models import Task
from tasks.serializers import TaskSerializer
from users.models import User
from users.serializers import UserSerializer

import datetime


class ExploreFeedPagination(CursorPagination):
    page_size = 8
    ordering = "-followings_count"


class ExploreFeedView(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = UserSerializer
    pagination_class = ExploreFeedPagination

    def get_queryset(self):
        user: User = self.request.user  # pyright: ignore [reportAssignmentType]
        followees = User.objects.filter(followers__follower=user)
        recommendUserFilter = Q(followers__follower=user) | Q(id=user.id)

        feeds_queryset = (
            User.objects.filter(followers__follower__in=followees)
            .distinct()
            .exclude(recommendUserFilter)
        )
        # TODO: exclude private user

        return feeds_queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class ExploreSearchView(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = UserSerializer
    pagination_class = ExploreFeedPagination

    def get_queryset(self):
        keyword = self.request.GET.get("query")

        if keyword is None:
            raise RequiredFieldMissing

        users_queryset = User.objects.filter(username__icontains=keyword)

        return users_queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class FollowingView(APIView):
    permission_classes = (permissions.FollowingPermission,)

    def get_related_users(self):
        follower_username: str = self.kwargs["follower_username"]
        followee_username: str = self.kwargs["followee_username"]

        follower = get_object_or_404(User, username=follower_username)
        followee = get_object_or_404(User, username=followee_username)

        return (follower, followee)

    def put(self, request: AuthenticatedRequest, **kwargs):
        (follower, followee) = self.get_related_users()

        following, created = Following.objects.get_or_create(
            follower=follower,
            followee=followee,
            defaults={"status": Following.REQUESTED},
        )

        if permissions.is_either_blocked(follower.username, followee.username):
            raise exceptions.FollowingRestricted

        if not created:
            if following.status in (Following.ACCEPTED, Following.REQUESTED):
                return Response(status=status.HTTP_208_ALREADY_REPORTED)

            following.status = Following.REQUESTED
            following.deleted_at = None
            following.save()

        serializer = FollowingSerializer(following)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request, **kwargs):
        (follower, followee) = self.get_related_users()

        following_filter = (
            Q(status=Following.REQUESTED) | Q(status=Following.ACCEPTED)
        ) & Q(follower=follower, followee=followee)

        try:
            following = Following.objects.get(following_filter)
        except Following.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = FollowingSerializer(following)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request: AuthenticatedRequest, **kwargs):
        new_status = request.data.get("status")

        if new_status not in (Following.ACCEPTED, Following.REJECTED):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        (follower, followee) = self.get_related_users()

        try:
            following = Following.objects.get(
                follower=follower, followee=followee, status=Following.REQUESTED
            )
        except Following.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)

        following.status = new_status
        following.save()

        serializer = FollowingSerializer(following)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    def delete(self, request, **kwargs):
        (follower, followee) = self.get_related_users()

        try:
            following = Following.objects.get(follower=follower, followee=followee)
        except Following.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)

        if following.status == Following.CANCELED:
            return Response(status=status.HTTP_208_ALREADY_REPORTED)

        following.status = Following.CANCELED
        following.deleted_at = timezone.now()
        following.save()

        return Response(status=status.HTTP_200_OK)


class GenericUserList(generics.ListAPIView):
    serializer_class = UserSerializer
    lookup_field = "username"
    permission_classes = [permissions.IsUserNotBlockedOrBlocking]

    def check_user_exists(self):
        username: str = self.kwargs["username"]
        user_exists = User.objects.filter(username=username).exists()

        if not user_exists:
            raise NotFound(f"User @{username} not found")

        return username

    def get_user_ids(self, username: str):
        raise NotImplementedError()

    def get_queryset(self):
        return User.objects.all()

    def filter_queryset(self, queryset: "QuerySet[User]"):
        username = self.check_user_exists()
        user_ids = self.get_user_ids(username)
        return queryset.filter(id__in=user_ids).all()


class FollowingList(GenericUserList):
    def get_user_ids(self, username: str):
        return (
            Following.objects.filter(
                follower__username=username, status=Following.ACCEPTED
            )
            .values("followee")
            .all()
        )


class FollowerList(GenericUserList):
    def get_user_ids(self, username: str):
        return (
            Following.objects.filter(
                followee__username=username, status=Following.ACCEPTED
            )
            .values("follower")
            .all()
        )


class FollowRequesterList(GenericUserList):
    permission_classes = [IsUserSelfRequest]

    def get_user_ids(self, username: str):
        return (
            Following.objects.filter(
                followee__username=username, status=Following.REQUESTED
            )
            .values("follower")
            .all()
        )


## Block
class BlockView(APIView):
    permission_classes = (permissions.BlockPermission,)

    def put(self, request, blocker_username: str, blockee_username: str):
        if blocker_username == blockee_username:
            raise exceptions.BlockSelf

        blocker = get_object_or_404(User, username=blocker_username)
        blockee = get_object_or_404(User, username=blockee_username)

        try:
            block = Block.objects.create(blocker=blocker, blockee=blockee)
        except IntegrityError:
            return Response(status=status.HTTP_208_ALREADY_REPORTED)

        serializer = BlockSerializer(block)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request, blocker_username: str, blockee_username: str):
        block = get_object_or_404(
            Block,
            blocker__username=blocker_username,
            blockee__username=blockee_username,
        )

        serializer = BlockSerializer(block)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, blocker_username: str, blockee_username: str):
        block = get_object_or_404(
            Block,
            blocker__username=blocker_username,
            blockee__username=blockee_username,
        )
        block.delete()

        return Response(status=status.HTTP_200_OK)


class BlockList(GenericUserList):
    permission_classes = [IsUserSelfRequest]

    def get_user_ids(self, username: str):
        return (
            Block.objects.filter(blocker__username=username, deleted_at=None)
            .values("blockee")
            .all()
        )


## Daily Logs
@api_view(["GET"])
def get_daily_logs(request: Request, username, day):
    followings = Following.objects.filter(
        follower__username=username, status=Following.ACCEPTED
    ).all()

    user_id = str(get_object_or_404(User, username=username).id)
    daily_logs_filter = Q(followers__in=followings.all()) | Q(id=user_id)

    followingUsers = User.objects.filter(daily_logs_filter).all().distinct()
    day = datetime.datetime.fromisoformat(day)

    day_min = day
    day_max = day + datetime.timedelta(hours=24) - datetime.timedelta(seconds=1)

    serializer = DailyLogsSerializer(
        followingUsers,
        context={"day_min": day_min, "day_max": day_max, "user_id": user_id},
        many=True,
    )

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_quote(request: AuthenticatedRequest, followee, day):
    followeeUser = get_object_or_404(User, username=followee)

    followerUserID = str(request.user.id)
    followeeUserID = str(followeeUser.id)

    # set cache for 'is_read'
    cache_key = f"user_id_{followeeUserID}_date_{day}"
    cache_data = cache.get(cache_key)
    if cache_data:
        cache_data[followerUserID] = datetime.datetime.now()
    else:
        cache_data = {followerUserID: datetime.datetime.now()}

    cache.delete(cache_key)
    # cache.set(cache_key, cache_data, 1*24*60*60)
    cache.set(cache_key, cache_data, 60 * 60)

    day_min = datetime.datetime.fromisoformat(day)
    day_max = day_min + datetime.timedelta(hours=24) - datetime.timedelta(seconds=1)
    quote = Quote.objects.filter(
        user__id=followeeUserID, date__range=(day_min, day_max)
    ).first()

    if not quote:
        quote = Quote(id=None, user=followeeUser, content="", date=None)
    serializer = QuoteSerializer(quote)

    # Response(cache_data, status=status.HTTP_200_OK)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def post_quote(request: Request, day):
    day_min = datetime.datetime.fromisoformat(day)
    day_max = day_min + datetime.timedelta(hours=24) - datetime.timedelta(seconds=1)

    quote = Quote.objects.filter(
        user=request.user, date__range=(day_min, day_max)
    ).first()
    content = request.data.get("content")

    if quote:
        quote.content = content if content is not None else ""
        quote.save()
    else:
        quote = Quote.objects.create(user=request.user, content=content, date=day)

    serializer = QuoteSerializer(quote)

    return Response(serializer.data, status=status.HTTP_201_CREATED)


class RemarkDetail(generics.GenericAPIView):
    serializer_class = RemarkSerializer
    permission_classes = (permissions.RemarkDetailPermission,)

    def get_url_args(self):
        username: str = self.kwargs["username"]
        date_iso: str = self.kwargs["date_iso"]
        date = datetime.date.fromisoformat(date_iso)

        return (username, date)

    def get_object(self):
        (username, date) = self.get_url_args()
        return Remark.objects.filter(user__username=username, date=date).first()

    def get(self, request: Request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def put(self, request: Request, **kwargs):
        (username, date) = self.get_url_args()
        request.data["date"] = date.isoformat()

        instance = Remark.objects.filter(user__username=username, date=date).first()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK if instance else status.HTTP_201_CREATED,
        )

    def delete(self, request: Request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        instance.delete()

        return Response(status=status.HTTP_200_OK)


def get_privacy_filter(follower, followee):
    if follower == followee:
        privacyFilter = Q()
        # privacy = PrivacyMixin.FOR_PROTECTED
    # TODO: BLOCK
    else:
        is_follower = Following.objects.filter(
            follower=follower, followee=followee, status=Following.ACCEPTED
        ).exists()

        if is_follower:
            privacyFilter = Q(privacy=PrivacyMixin.FOR_PUBLIC) | Q(
                privacy=PrivacyMixin.FOR_PROTECTED
            )
            # privacy = PrivacyMixin.FOR_PROTECTED
        else:
            privacyFilter = Q(privacy=PrivacyMixin.FOR_PUBLIC)
            # privacy = PrivacyMixin.FOR_PUBLIC

    privacyFilter &= Q(user=followee)

    return privacyFilter


class DailyLogDetailsPagination(CursorPagination):
    page_size = 5
    ordering = ["project_order", "drawer_order", "order"]


class DailyLogDetailsView(generics.GenericAPIView):
    pagination_class = DailyLogDetailsPagination

    def get(self, request, followee, day):
        followee_user = get_object_or_404(User, username=followee)
        day_min = datetime.datetime.fromisoformat(day)
        day_max = day_min + datetime.timedelta(hours=24) - datetime.timedelta(seconds=1)
        day_range = (day_min, day_max)

        privacy_filter = get_privacy_filter(request.user, followee_user)

        completed_tasks_filter = Q(completed_at__range=day_range)
        uncompleted_tasks_filter = Q(completed_at=None) & Q(
            assigned_at__range=day_range
        )
        # TODO: ( | Q(due_datetime__range=day_range))
        tasks_filter = privacy_filter & (
            completed_tasks_filter | uncompleted_tasks_filter
        )

        tasks_queryset = (
            Task.objects.filter(tasks_filter)
            .all()
            .annotate(
                project_order=F("drawer__project__order"),
                drawer_order=F("drawer__order"),
            )
        )

        page = self.paginate_queryset(tasks_queryset)
        if page is not None:
            serializer = DailyLogDetailsSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = DailyLogDetailsSerializer(tasks_queryset, many=True)

        return Response(serializer.data)


class DailyLogDrawerPagination(CursorPagination):
    page_size = 5
    ordering = "order"
    # TODO: due date 찾을 수 있으면 줄이기


class DailyLogDrawerView(generics.GenericAPIView):
    pagination_class = DailyLogDrawerPagination

    def get(self, request, followee):
        followeeUser = get_object_or_404(User, username=followee)

        privacyFilter = get_privacy_filter(request.user, followeeUser)

        drawers_queryset = (
            Drawer.objects.filter(privacyFilter)
            .annotate(color=F("project__color"))
            .order_by("order")
        )

        page = self.paginate_queryset(drawers_queryset)

        if page is not None:
            serializer = DailyLogDrawerSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = DailyLogDrawerSerializer(drawers_queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class DailyLogTaskPagination(PageNumberPagination):
    page_size = 5
    max_page_size = 5
    # TODO: due date 찾을 수 있으면 줄이기


class DailyLogTaskView(generics.GenericAPIView):
    pagination_class = DailyLogTaskPagination

    def get(self, request, drawer, day):
        drawer = get_object_or_404(Drawer, id=drawer)
        # followee = drawer.user

        # TODO: task Privacy 반영 이후 다시 고려
        # privacyFilter = get_privacy_filter(request.user, followee)
        privacyFilter = Q()

        day_min = datetime.datetime.fromisoformat(day)
        day_max = day_min + datetime.timedelta(hours=24) - datetime.timedelta(seconds=1)
        day_range = (day_min, day_max)

        tasksFilterForCompleted = Q(completed_at__range=day_range)
        tasksFilterForUncompleted = Q(completed_at=None) & Q(
            assigned_at__range=day_range
        )
        # TODO: ( | Q(due_datetime__range=day_range))
        tasksFilter = (
            Q(drawer=drawer)
            & privacyFilter
            & (tasksFilterForCompleted | tasksFilterForUncompleted)
        )

        tasks_queryset = Task.objects.filter(tasksFilter)

        page = self.paginate_queryset(tasks_queryset)
        if page is not None:
            serializer = TaskSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = TaskSerializer(tasks_queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecordDetail(TimezoneMixin, generics.ListAPIView):
    request: AuthenticatedRequest  # pyright: ignore [reportIncompatibleVariableOverride]
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = (permissions.IsUserNotBlockedOrBlocking,)

    def get_privacy_filter(self, viewer: User, target: User):
        is_following = (
            viewer == target
            or Following.objects.filter(
                follower=viewer, followee=target, status=Following.ACCEPTED
            ).exists()
        )

        filter = Q(privacy=PrivacyMixin.FOR_PUBLIC)

        if is_following:
            filter |= Q(privacy=PrivacyMixin.FOR_PROTECTED)

        if viewer == target:
            filter |= Q(privacy=PrivacyMixin.FOR_PRIVATE)

        return filter

    def filter_queryset(self, queryset: QuerySet[Task]) -> QuerySet[Task]:
        user = get_object_or_404(User, username=self.kwargs["username"])
        date = datetime.date.fromisoformat(self.kwargs["date_iso"])
        datetime_range = self.get_datetime_range(date)

        privacy_filter = self.get_privacy_filter(self.request.user, user)
        completed_filter = Q(completed_at__range=datetime_range)
        uncompleted_filter = Q(completed_at=None) & (
            Q(assigned_at=date)
            | Q(due_datetime__range=datetime_range)
            | Q(due_date=date)
        )

        return queryset.filter(
            Q(user=user) & privacy_filter & (completed_filter | uncompleted_filter)
        ).order_by(F("drawer__project__order"), F("drawer__order"), "order")


class StatListPagination(PageNumberPagination):
    page_size = 6
    max_page_size = 6

    def get_paginated_data(self, data):
        assert self.page is not None
        return {
            "count": self.page.paginator.count,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "results": data,
        }


class StatList(TimezoneMixin, generics.GenericAPIView):
    pagination_class = StatListPagination
    serializer_class = StatSerializer
    request: AuthenticatedRequest  # pyright: ignore [reportIncompatibleVariableOverride]

    def get_cache_key(self):
        date_iso = self.kwargs.get("date_iso")
        page_number = self.request.query_params.get("page") or 1
        return f"stats/{self.request.user.id}/{date_iso}T{self.get_tz().key}?page={page_number}"

    def get(self, request: AuthenticatedRequest, date_iso: str, *args, **kwargs):
        cache_key = self.get_cache_key()
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        user_ids = (
            Following.objects.filter(follower=request.user, status=Following.ACCEPTED)
            .order_by("-updated_at")
            .values_list("followee", flat=True)
        )
        paginated_user_ids = self.paginate_queryset(
            user_ids  # pyright: ignore [reportArgumentType] -- ValuesQuerySet is compatible with QuerySet
        )
        if not paginated_user_ids:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        date = datetime.date.fromisoformat(date_iso)
        datetime_range = self.get_datetime_range(date)

        stats = User.objects.filter(id__in=paginated_user_ids).annotate(
            completed_task_count=Count(
                "tasks",
                filter=Q(
                    tasks__completed_at__range=datetime_range,
                    tasks__privacy__in=(
                        PrivacyMixin.FOR_PUBLIC,
                        PrivacyMixin.FOR_PROTECTED,
                    ),
                ),
                distinct=True,
            ),
            reaction_count=Count(
                "reactions",
                filter=Q(
                    tasks__user__id=F("id"),
                    tasks__completed_at__range=datetime_range,
                    tasks__privacy__in=(
                        PrivacyMixin.FOR_PUBLIC,
                        PrivacyMixin.FOR_PROTECTED,
                    ),
                    tasks__reactions__created_at__range=datetime_range,
                ),
            ),
            date=Value(date_iso),
        )
        data = self.get_serializer(stats, many=True).data
        paginated_data = self.paginator.get_paginated_data(data)  # pyright: ignore[reportAttributeAccessIssue] -- StatListPagination has get_paginated_data method

        cache.set(
            cache_key,
            paginated_data,
            5 if datetime_range[0] <= self.get_now() <= datetime_range[1] else 60,
        )  # Cache for 5 seconds if within the date range, otherwise 60 seconds
        return Response(
            paginated_data,
            status=status.HTTP_200_OK,
        )


class StatDetail(TimezoneMixin, generics.RetrieveAPIView):
    request: AuthenticatedRequest  # pyright: ignore [reportIncompatibleVariableOverride]
    serializer_class = StatSerializer
    lookup_field = "username"
    permission_classes = (permissions.IsUserNotBlockedOrBlocking,)

    def get_privacy_options(self, viewer_username: str, target_username: str):
        if viewer_username == target_username:
            return (
                PrivacyMixin.FOR_PUBLIC,
                PrivacyMixin.FOR_PROTECTED,
                PrivacyMixin.FOR_PRIVATE,
            )

        is_following = Following.objects.filter(
            follower__username=viewer_username,
            followee__username=target_username,
            status=Following.ACCEPTED,
        ).exists()

        if is_following:
            return (PrivacyMixin.FOR_PUBLIC, PrivacyMixin.FOR_PROTECTED)

        return (PrivacyMixin.FOR_PUBLIC,)

    def get_object(self):
        username = self.kwargs.get("username")
        date_iso = self.kwargs.get("date_iso")
        date = datetime.date.fromisoformat(date_iso)
        datetime_range = self.get_datetime_range(date)

        privacy_options = self.get_privacy_options(self.request.user.username, username)

        completed_task_count = Task.objects.filter(
            completed_at__range=datetime_range,
            privacy__in=privacy_options,
            user__username=username,
        ).count()

        reaction_count = Reaction.objects.filter(
            user__username=username,
            created_at__range=datetime_range,
        ).count()

        stat = (
            User.objects.filter(username=username)
            .annotate(
                completed_task_count=Value(completed_task_count),
                reaction_count=Value(reaction_count),
                date=Value(date_iso),
            )
            .first()
        )

        if not stat:
            raise NotFound(f"User @{username} not found")
        return stat


class ReactionView(APIView):
    def get(self, request, type, id):
        user = request.user

        if type == Reaction.FOR_TASK:
            task = get_object_or_404(Task, id=id)
            reactions = Reaction.objects.filter(
                parent_type=Reaction.FOR_TASK, task=task
            ).order_by("created_at")
        elif type == Reaction.FOR_QUOTE:
            quote = get_object_or_404(Quote, id=id)
            reactions = Reaction.objects.filter(
                parent_type=Reaction.FOR_QUOTE, quote=quote
            ).order_by("created_at")
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        reactionCountsDir = dict()
        myReactions = []
        for reaction in reactions:
            if reaction.emoji is None:
                continue

            if reaction.user == user:
                myReactions.append(EmojiSerializer(reaction.emoji).data)

            emoji_id = str(reaction.emoji.id)
            reactionNum = reactionCountsDir.get(emoji_id)
            if reactionNum:
                reactionCountsDir[emoji_id]["counts"] = reactionNum["counts"] + 1
            else:
                reactionCountsDir[emoji_id] = {
                    "emoji": EmojiSerializer(reaction.emoji).data,
                    "counts": 1,
                }

        serializer = ReactionSerializer(reactions, many=True)

        data = {
            "reactions": serializer.data,
            "reaction_counts": reactionCountsDir,
            "my_reactions": myReactions,
        }

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request: Request, type, id):
        # TODO: Need to check block
        emoji_name = request.data.get("emoji")
        emoji = get_object_or_404(Emoji, name=emoji_name)
        user = request.user

        if type == Reaction.FOR_TASK:
            task = get_object_or_404(Task, id=id)
            reaction, created = Reaction.objects.get_or_create(
                user=user, parent_type=Reaction.FOR_TASK, task=task, emoji=emoji
            )

        elif type == Reaction.FOR_QUOTE:
            quote = get_object_or_404(Quote, id=id)
            reaction, created = Reaction.objects.get_or_create(
                user=user, parent_type=Reaction.FOR_QUOTE, quote=quote, emoji=emoji
            )
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if not created:
            return Response(status=status.HTTP_208_ALREADY_REPORTED)

        serializer = ReactionSerializer(reaction)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, type, id):
        emoji_name = request.GET.get("emoji")
        emoji = get_object_or_404(Emoji, name=emoji_name)

        # emoji = Emoji.objects.filter(id=emoji_id).first()

        user = request.user

        if type == Reaction.FOR_TASK:
            task = get_object_or_404(Task, id=id)
            reaction = get_object_or_404(
                Reaction,
                user=user,
                parent_type=Reaction.FOR_TASK,
                task=task,
                emoji=emoji,
            )
        elif type == Reaction.FOR_QUOTE:
            quote = get_object_or_404(Quote, id=id)
            reaction = get_object_or_404(
                Reaction,
                user=user,
                parent_type=Reaction.FOR_QUOTE,
                quote=quote,
                emoji=emoji,
            )
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        reaction.delete()

        return Response(status=status.HTTP_200_OK)


class PeckView(APIView):
    def get(self, request, id):
        task = get_object_or_404(Task, id=id)
        pecks = Peck.objects.filter(task=task)

        serializer = PeckSerializer(pecks, many=True)
        pecksCounts = self.countPeck(pecks)

        data = {"pecks": serializer.data, "pecks_counts": pecksCounts}

        return Response(data, status=status.HTTP_201_CREATED)

    def post(self, request, id):
        user = request.user
        task = get_object_or_404(Task, id=id)
        peck = Peck.objects.filter(user=user, task=task).first()

        if peck:
            peck.count += 1
            peck.save()
        else:
            peck = Peck.objects.create(user=user, task=task, count=1)
        pecks = Peck.objects.filter(task=task)

        serializer = PeckSerializer(pecks, many=True)
        # pecksCounts = self.countPeck(pecks)

        # data = {"pecks": serializer.data, "pecks_counts": pecksCounts}

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def countPeck(self, pecks):
        pecksCounts = 0
        for peck in pecks:
            pecksCounts += peck.count

        return pecksCounts


class CommentView(APIView):
    def get(self, request, type, id):
        if type == Comment.FOR_TASK:
            task = get_object_or_404(Task, id=id)
            comments = Comment.objects.filter(
                parent_type=Reaction.FOR_TASK, task=task
            ).order_by("-created_at")
        else:
            quote = get_object_or_404(Quote, id=id)
            comments = Comment.objects.filter(
                parent_type=Reaction.FOR_QUOTE, quote=quote
            ).order_by("-created_at")

        serializer = CommentSerializer(comments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, type, id):
        user = request.user
        comment = request.data.get("comment")

        # TODO: check block
        if type == Comment.FOR_TASK:
            task = get_object_or_404(Task, id=id)
            created = Comment.objects.create(
                user=user, parent_type=Reaction.FOR_TASK, task=task, comment=comment
            )
        elif type == Comment.FOR_QUOTE:
            quote = get_object_or_404(Quote, id=id)
            created = Comment.objects.create(
                user=user, parent_type=Reaction.FOR_QUOTE, quote=quote, comment=comment
            )
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = CommentSerializer(created, many=False)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request, type, id):
        user = request.user

        commentID = request.data.get("id")
        comment = get_object_or_404(Comment, id=commentID)
        if comment.user != user:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

        # 과거 코맨트 기록들을 저장할 필요가 있을까?
        newComment = request.data.get("comment")
        # serializer = CommentSerializer(comment, data={'comment': newComment}, partial=True)
        comment.comment = newComment
        comment.save()

        serializer = CommentSerializer(comment)

        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    def delete(self, request, type, id):
        user = request.user

        commentID = request.data.get("id")
        comment = get_object_or_404(Comment, id=commentID)
        if comment.user != user:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        # TODO: soft delete
        comment.delete()

        return Response(status=status.HTTP_200_OK)


class EmojiListPagination(PageNumberPagination):
    page_size = 1000


class EmojiList(mixins.ListModelMixin, generics.GenericAPIView):
    queryset = Emoji.objects.order_by("name").all()
    serializer_class = EmojiSerializer
    pagination_class = EmojiListPagination

    permission_classes = (AllowAny,)

    @method_decorator(cache_page(60 * 30))  # caching for 30 minutes
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
