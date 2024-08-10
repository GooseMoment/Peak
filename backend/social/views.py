from rest_framework import status, mixins, generics
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny

from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.db.models import Q, F, Prefetch

from datetime import datetime, timedelta

from .models import *
from .serializers import *
from api.models import PrivacyMixin
from drawers.models import Drawer

from users.serializers import UserSerializer

@api_view(["GET"])
def get_explore_feed(request: HttpRequest):
    user = request.user
    
    followees = User.objects.filter(followers__follower=user)
    
    recommendUserFilter = Q(followers__follower=user) | Q(id=user.id)

    secondFollowees = User.objects.filter(
        followers__follower__in=followees
    ).distinct().exclude(recommendUserFilter)
    # TODO: exclude private user

    serializer = UserSerializer(secondFollowees, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

class FollowView(APIView):
    #request 확인 기능 넣기
    #block 검사
    def put(self, request, follower, followee):
        followerUser = get_object_or_404(User, username=follower)
        followeeUser = get_object_or_404(User, username=followee)
# requested -> 상황에 따라!
        try:
            created = Following.objects.create(follower=followerUser, followee=followeeUser, status=Following.REQUESTED)
        except:
            return Response(status=status.HTTP_208_ALREADY_REPORTED)
        
        serializer = FollowingSerializer(created)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request, follower, followee):
        following = get_object_or_404(Following, follower__username=follower, followee__username=followee)
        
        serializer = FollowingSerializer(following)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, follower, followee):
        following = get_object_or_404(Following, follower__username=follower, followee__username=followee)
        
        following.status = Following.CANCELED
        following.save()
        
        return Response(status=status.HTTP_202_ACCEPTED)
    
    def delete(self, request, follower, followee):
        following = get_object_or_404(Following, follower__username=follower, followee__username=followee)
        #TODO: soft delete
        following.delete()
        
        return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
def get_followers(request: HttpRequest, username):
    followers = Following.objects.filter(followee__username=username).all()
    followerUsers = User.objects.filter(followings__in=followers.all()).all()
    
    serializer = UserSerializer(followerUsers, many=True)    
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def get_followings(request: HttpRequest, username):
    followings = Following.objects.filter(follower__username=username).all()
    followingUsers = User.objects.filter(followers__in=followings.all()).all()
    
    serializer = UserSerializer(followingUsers, many=True)    
    
    return Response(serializer.data, status=status.HTTP_200_OK)

## Block
class BlockView(APIView):
    # TODO 상대 볼 수 없게/
    def put(self, request, blocker, blockee):
        blockerUser = get_object_or_404(User, username=blocker)
        blockeeUser = get_object_or_404(User, username=blockee)
        
        try:
            created = Block.objects.create(blocker=blockerUser, blockee=blockeeUser)
        except:
            return Response(status=status.HTTP_208_ALREADY_REPORTED)
        
        serializer = BlockSerializer(created)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request, blocker, blockee):
        blocking = get_object_or_404(Block, blocker__username=blocker, blockee__username=blockee)
        
        serializer = BlockSerializer(blocking)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, blocker, blockee):
        blocking = get_object_or_404(Block, blocker__username=blocker, blockee__username=blockee)
        #soft delete
        blocking.delete()
        
        return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
def get_blocks(request: HttpRequest, username):
    blocks = Block.objects.filter(blocker__username=username).all()
    blockUsers = User.objects.filter(blockers__in=blocks.all()).all()
    
    serializer = UserSerializer(blockUsers, many=True)    
    
    return Response(serializer.data, status=status.HTTP_200_OK)

## Daily Logs
@api_view(["GET"])
def get_daily_logs(request: HttpRequest, username, day):
    followings = Following.objects.filter(
        follower__username=username,
        status=Following.ACCEPTED
    ).all()
    followingUsers = User.objects.filter(followers__in=followings.all()).all()
    day = datetime.fromisoformat(day)
    
    user_id = str(get_object_or_404(User, username=username).id)
    day_min = day
    day_max = day + timedelta(hours=24) - timedelta(seconds=1)
    
    serializer = DailyLogsSerializer(followingUsers, context={'day_min': day_min, 'day_max':day_max, 'user_id':user_id}, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def get_quote(requset: HttpRequest, followee, day):    
    followeeUser = get_object_or_404(User, username=followee)
    
    followerUserID = str(requset.user.id)
    followeeUserID = str(followeeUser.id)

    # set cache for 'is_read'
    cache_key = f"user_id_{followeeUserID}_date_{day}"
    cache_data = cache.get(cache_key)
    if cache_data:
        cache_data[followerUserID] = datetime.now()
    else:
        cache_data = {followerUserID: datetime.now()}
    
    cache.delete(cache_key)
    # cache.set(cache_key, cache_data, 1*24*60*60)
    cache.set(cache_key, cache_data, 60*60)
    
    day_min = datetime.fromisoformat(day)
    day_max = day_min + timedelta(hours=24) - timedelta(seconds=1)
    quote = Quote.objects.filter(user__id=followeeUserID, date__range=(day_min, day_max)).first()
    
    if not quote:
        quote = Quote(id=None, user=followeeUser, content='', date=None)
    serializer = QuoteSerializer(quote)
    
    # Response(cache_data, status=status.HTTP_200_OK)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
def post_quote(request: Request, day):
    day_min = datetime.fromisoformat(day)
    day_max = day_min + timedelta(hours=24) - timedelta(seconds=1)
    
    quote = Quote.objects.filter(user=request.user, date__range=(day_min, day_max)).first()
    content = request.data.get('content')
    
    if quote:
        quote.content = content
        quote.save()
    else:
        quote = Quote.objects.create(user=request.user, content=content, date=day)
    
    serializer = QuoteSerializer(quote)
    
    return Response(serializer.data, status=status.HTTP_201_CREATED)

def get_privacy_filter(follower, followee):
    if follower == followee:
        privacyFilter = Q()
        privacy = PrivacyMixin.FOR_PROTECTED
    # TODO: BLOCK
    else:
        is_follower = Following.objects.filter(
            follower=follower,
            followee=followee,
            status=Following.ACCEPTED
        ).exists()
        
        if is_follower:
            privacyFilter = Q(privacy=PrivacyMixin.FOR_PUBLIC) | Q(privacy=PrivacyMixin.FOR_PROTECTED)
            privacy = PrivacyMixin.FOR_PROTECTED
        else:
            privacyFilter = Q(privacy=PrivacyMixin.FOR_PUBLIC)
            privacy = PrivacyMixin.FOR_PUBLIC
    
    privacyFilter &= Q(user=followee)
    
    return privacyFilter

class DailyLogDrawerPagination(PageNumberPagination):
    page_size = 5
    max_page_size = 5
    # TODO: due date 찾을 수 있으면 줄이기

class DailyLogDrawerView(generics.GenericAPIView):
    
    pagination_class = DailyLogDrawerPagination
    
    def get(self, request, followee):
        followeeUser = get_object_or_404(User, username=followee)

        privacyFilter = get_privacy_filter(request.user, followeeUser)
        
        drawers_queryset = Drawer.objects.filter(privacyFilter).annotate(color=F('project__color')).order_by('order')
        
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
        followee = drawer.user
        
        # TODO: task Privacy 반영 이후 다시 고려
        # privacyFilter = get_privacy_filter(request.user, followee)
        privacyFilter = Q()
        
        day_min = datetime.fromisoformat(day)
        day_max = day_min + timedelta(hours=24) - timedelta(seconds=1)
        day_range = (day_min, day_max)

        tasksFilterForCompleted = Q(completed_at__range=day_range)
        tasksFilterForUncompleted = Q(completed_at=None) & Q(assigned_at__range=day_range)
        # TODO: ( | Q(due_datetime__range=day_range))
        tasksFilter = Q(drawer=drawer) & privacyFilter & (tasksFilterForCompleted | tasksFilterForUncompleted)

        tasks_queryset = Task.objects.filter(tasksFilter)

        page = self.paginate_queryset(tasks_queryset)
        if page is not None:
            serializer = TaskSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = TaskSerializer(tasks_queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

def get_following_feed(request: HttpRequest, date):
    pass

class ReactionView(APIView):
    def get(self, request, type, id):
        user = request.user

        if type == Reaction.FOR_TASK:
            task = get_object_or_404(Task, id=id)
            reactions = Reaction.objects.filter(parent_type=Reaction.FOR_TASK,
                                                task=task).order_by("created_at")
        elif type == Reaction.FOR_QUOTE:
            quote = get_object_or_404(Quote, id=id)
            reactions = Reaction.objects.filter(parent_type=Reaction.FOR_QUOTE,
                                                quote=quote).order_by("created_at")
        else :
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        reactionCountsDir = dict()
        myReactions = []
        for reaction in reactions:
            if reaction.user == user:
                myReactions.append(EmojiSerializer(reaction.emoji).data)
            
            emoji_id = str(reaction.emoji.id)
            reactionNum = reactionCountsDir.get(emoji_id)
            if reactionNum:
                reactionCountsDir[emoji_id]["counts"] = reactionNum["counts"] + 1
            else:
                reactionCountsDir[emoji_id] = {"emoji": EmojiSerializer(reaction.emoji).data, "counts": 1}
        
        serializer = ReactionSerializer(reactions, many=True)
        
        data = {
            'reactions': serializer.data,
            'reaction_counts': reactionCountsDir,
            'my_reactions': myReactions
        }
        
        return Response(data, status=status.HTTP_200_OK)
    
    def post(self, request: Request, type, id):
        # TODO: Need to check block
        emoji_name = request.data.get('emoji')
        emoji = get_object_or_404(Emoji, name=emoji_name)
        user = request.user
        
        if type == Reaction.FOR_TASK:
            task = get_object_or_404(Task, id=id)
            reaction, created = Reaction.objects.get_or_create(user=user,
                                                               parent_type=Reaction.FOR_TASK,
                                                               task=task,
                                                               emoji=emoji)
        
        elif type == Reaction.FOR_QUOTE:
            quote = get_object_or_404(Quote, id=id)
            reaction, created = Reaction.objects.get_or_create(user=user,
                                                               parent_type=Reaction.FOR_QUOTE,
                                                               quote=quote,
                                                               emoji=emoji)
        else :
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        if not created:
            return Response(status=status.HTTP_208_ALREADY_REPORTED)
        
        serializer = ReactionSerializer(reaction)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, type, id):
        emoji_name = request.GET.get('emoji')
        emoji = get_object_or_404(Emoji, name=emoji_name)
        
        # emoji = Emoji.objects.filter(id=emoji_id).first()
        
        user = request.user
        
        if type == Reaction.FOR_TASK:
            task = get_object_or_404(Task, id=id)
            reaction = get_object_or_404(Reaction,
                                         user=user,
                                         parent_type=Reaction.FOR_TASK,
                                         task=task,
                                         emoji=emoji)
        elif type == Reaction.FOR_QUOTE:
            quote = get_object_or_404(Quote, id=id)
            reaction = get_object_or_404(Reaction,
                                         user=user,
                                         parent_type=Reaction.FOR_QUOTE,
                                         quote=quote,
                                         emoji=emoji)
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
        
        data = {
            'pecks': serializer.data,
            'pecks_counts': pecksCounts
        }
        
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
        pecksCounts = self.countPeck(pecks)
        
        data = {
            'pecks': serializer.data,
            'pecks_counts': pecksCounts
        }
        
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
            comments = Comment.objects.filter(parent_type=Reaction.FOR_TASK,
                                                task=task).order_by("-created_at")
        elif type == Comment.FOR_QUOTE:
            quote = get_object_or_404(Quote, id=id)
            comments = Comment.objects.filter(parent_type=Reaction.FOR_QUOTE,
                                                quote=quote).order_by("-created_at")
        
        serializer = CommentSerializer(comments, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, type, id):
        user = request.user
        comment = request.data.get('comment')
        
        # TODO: check block
        if type == Comment.FOR_TASK:
            task = get_object_or_404(Task, id=id)
            created = Comment.objects.create(user=user,
                                             parent_type=Reaction.FOR_TASK,
                                             task=task,
                                             comment=comment)
        elif type == Comment.FOR_QUOTE:
            quote = get_object_or_404(Quote, id=id)
            created = Comment.objects.create(user=user,
                                             parent_type=Reaction.FOR_QUOTE,
                                             quote=quote,
                                             comment=comment)
        else :
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CommentSerializer(created, many=False)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def patch(self, request, type, id):
        user = request.user
        
        commentID = request.data.get('id')
        comment = get_object_or_404(Comment, id=commentID)
        if comment.user != user:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        
        # 과거 코맨트 기록들을 저장할 필요가 있을까?
        newComment = request.data.get('comment')
        # serializer = CommentSerializer(comment, data={'comment': newComment}, partial=True)
        comment.comment = newComment
        comment.save()
        
        serializer = CommentSerializer(comment)
        
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
    
    def delete(self, request, type, id):
        user = request.user
        
        commentID = request.data.get('id')
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

    permission_classes = (AllowAny, )

    @method_decorator(cache_page(60 * 30)) # caching for 30 minutes
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

@api_view(["GET"])
def get_explore_search_results(request: Request):
    keyword = request.GET.get('query')
    
    if keyword is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    users = User.objects.filter(username__icontains=keyword)
    serializer = UserSerializer(users, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)
