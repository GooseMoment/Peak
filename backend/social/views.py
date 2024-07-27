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

## Follow
# social/follow/@follower/@followee/
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
# GET social/daily/logs/@username/YYYY-MM-DDTHH:mm:ss+hh:mm/
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

# GET social/daily/comment/@followee/YYYY-MM-DDTHH:mm:ss+hh:mm/
@api_view(["GET"])
def get_daily_comment(requset: HttpRequest, followee, day):    
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
    daily_comment = DailyComment.objects.filter(user__id=followeeUserID, date__range=(day_min, day_max)).first()
    
    if not daily_comment:
        daily_comment = DailyComment(id=None, user=followeeUser, comment='', date=None)
    serializer = DailyCommentSerializer(daily_comment)
    
    # Response(cache_data, status=status.HTTP_200_OK)
    return Response(serializer.data, status=status.HTTP_200_OK)

# POST social/daily/logs/YYYY-MM-DDTHH:mm:ss+hh:mm/
@api_view(["POST"])
def post_comment_to_daily_comment(request: Request, day):
    day_min = datetime.fromisoformat(day)
    day_max = day_min + timedelta(hours=24) - timedelta(seconds=1)
    
    daily_comment = DailyComment.objects.filter(user=request.user, date__range=(day_min, day_max)).first()
    comment = request.data.get('comment')
    
    if daily_comment:
        daily_comment.comment = comment
        daily_comment.save()
    else:
        daily_comment = DailyComment.objects.create(user=request.user, comment=comment, date=day)
    
    serializer = DailyCommentSerializer(daily_comment)
    
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(["GET"])
def get_daily_log_details(requset: HttpRequest, followee, day):
    followeeUser = get_object_or_404(User, username=followee)
    
    is_follower = Following.objects.filter(
        follower=requset.user,
        followee=followeeUser,
        status=Following.ACCEPTED
    ).exists()

    if requset.user.username == followee:   # is me
        privacyFilter = Q()
    elif is_follower:   # is follower
        privacyFilter = (Q(privacy=PrivacyMixin.FOR_PUBLIC) | Q(privacy=PrivacyMixin.FOR_PROTECTED))
    else:
        privacyFilter = Q(privacy=PrivacyMixin.FOR_PUBLIC)
    # TODO: need to check block

    privacyFilter &= Q(user=followeeUser)
    
    day_min = datetime.fromisoformat(day)
    day_max = day_min + timedelta(hours=24) - timedelta(seconds=1)
    
    tasksFilterForCompleted = Q(completed_at__range=(day_min, day_max))
    tasksFilterForUncompleted = Q(completed_at=None)
    tasksFilter = privacyFilter & (tasksFilterForCompleted | tasksFilterForUncompleted)
    
    # TODO: order of tasks
    prefetch_tasks = Prefetch('tasks', queryset=Task.objects.filter(tasksFilter))
    
    # TODO: Do not process if there is no task in the drawer
    drawers = Drawer.objects.filter(privacyFilter).prefetch_related(prefetch_tasks).annotate(color=F('project__color')).order_by('order')
    
    serializer = DailyLogDetailsSerializer(drawers, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)
      
def get_following_feed(request: HttpRequest, date):
    pass

def get_explore_feed(request: HttpRequest, user_id):
    pass

def get_emojis(request: HttpRequest):
    pass

class ReactionView(APIView):
    def get(self, request, type, id):
        user = request.user

        if type == 'task':
            task = get_object_or_404(Task, id=id)
            # parent_type을 비교하는 게 속도 향상에 도움이 될진 모르겠음
            reactions = Reaction.objects.filter(parent_type=Reaction.FOR_TASK,
                                                task=task)
        elif type == 'daily_comment':
            daily_comment = get_object_or_404(DailyComment, id=id)
            reactions = Reaction.objects.filter(parent_type=Reaction.FOR_DAILY_COMMENT,
                                                daily_comment=daily_comment)
        
        serializer = ReactionSerializer(reactions, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, type, id):
        # TODO: Need to check block
        emoji_id = request.data.get('emoji')
        emoji = get_object_or_404(Emoji, id=emoji_id)
        user = request.user
        
        # 404는 부적절한가..?
        
        if type == 'task':
            task = get_object_or_404(Task, id=id)
            
            ## 정상적인 동작에선 찾을 필요가 없긴 함
            reaction = Reaction.objects.filter(user=user,
                                               parent_type=Reaction.FOR_TASK,
                                               task=task,
                                               emoji=emoji).first()
            if reaction: 
                return Response(status=status.HTTP_208_ALREADY_REPORTED)
            ## END
            
            reaction = Reaction.objects.create(user=user,
                                               parent_type=Reaction.FOR_TASK,
                                               task=task,
                                               emoji=emoji)
        elif type == 'daily_comment':
            daily_comment = get_object_or_404(DailyComment, id=id)
            
            ## 정상적인 동작에선 찾을 필요가 없긴 함
            reaction = Reaction.objects.filter(user=user,
                                               parent_type=Reaction.FOR_DAILY_COMMENT,
                                               daily_comment=daily_comment,
                                               emoji=emoji).first()
            if reaction: 
                return Response(status=status.HTTP_208_ALREADY_REPORTED)
            ## END
            
            reaction = Reaction.objects.create(user=user,
                                               parent_type=Reaction.FOR_DAILY_COMMENT,
                                               daily_comment=daily_comment,
                                               emoji=emoji)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST) #맞나..?
        
        serializer = ReactionSerializer(reaction)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, type, id):
        emoji_id = request.GET.get('emoji')
        emoji = get_object_or_404(Emoji, id=emoji_id)
        
        # emoji = Emoji.objects.filter(id=emoji_id).first()
        # 404는 부적절한가..?22
        
        user = request.user
        
        if type == 'task':
            task = get_object_or_404(Task, id=id)
            reaction = get_object_or_404(Reaction,
                                         user=user,
                                         parent_type=Reaction.FOR_TASK,
                                         task=task,
                                         emoji=emoji)
        elif type == 'daily_comment':
            daily_comment = get_object_or_404(DailyComment, id=id)
            reaction = get_object_or_404(Reaction,
                                         user=user,
                                         parent_type=Reaction.FOR_DAILY_COMMENT,
                                         daily_comment=daily_comment,
                                         emoji=emoji)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        reaction.delete()
        
        return Response(status=status.HTTP_200_OK)

def post_comment_to_task(request: HttpRequest, task_id, comment):
    pass

def post_peck(request: HttpRequest, task_id):
    pass
    
class EmojiListPagination(PageNumberPagination):
    page_size = 1000

class EmojiList(mixins.ListModelMixin, generics.GenericAPIView):
    queryset = Emoji.objects.all()
    serializer_class = EmojiSerializer
    pagination_class = EmojiListPagination

    permission_classes = (AllowAny, )

    @method_decorator(cache_page(60 * 60 * 5)) # caching for 5 hours 
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
