from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.core.cache import cache

from datetime import datetime, timedelta

from .models import *
from .serializers import *
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

## Daily Report
# TODO daily report에 관해 class based로 묶어서?
# GET social/daily/report/@username/YYYY-MM-DD'T'HH:mm:ss.SSS'Z'/
@api_view(["GET"])
def get_daily_report(request: HttpRequest, username, day):
    followings = Following.objects.filter(
        follower__username=username,
        status=Following.ACCEPTED
    ).all()
    followingUsers = User.objects.filter(followers__in=followings.all()).all()
    day = datetime.strptime(day, "%Y-%m-%dT%H:%M:%S.%fZ")
    
    day_min = day
    day_max = day + timedelta(hours=24) - timedelta(seconds=1)
    
    serializer = DailyReportSerializer(followingUsers, context={'day_min': day_min, 'day_max':day_max}, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK) 

# PUT social/daily/report/@follower/@followee/YYYY-MM-DD'T'HH:mm:ss.SSS'Z'/
@api_view(["PUT"])
def view_daily_report(requset: HttpRequest, follower, followee, day):
    followerUserID = str(get_object_or_404(User, username=follower).id)
    followeeUserID = str(get_object_or_404(User, username=followee).id)

    cache_key = f"followeeID_{followeeUserID}_date_{day}"
    cache_data = cache.get(cache_key)
    if cache_data:
        cache_data[followerUserID] = datetime.now()
    else:
        cache_data = {followerUserID: datetime.now()}
    
    cache.delete(cache_key)
    # cache.set(cache_key, cache_data, 1*24*60*60)
    cache.set(cache_key, cache_data, 5*60)
    
    return Response(cache_data, status=status.HTTP_200_OK)

def get_following_feed(request: HttpRequest, date):
    pass

def get_explore_feed(request: HttpRequest, user_id):
    pass

def get_emojis(request: HttpRequest):
    pass

def post_reaction(request: HttpRequest, task_id, emoji):
    pass

def delete_reaction(request: HttpRequest, task_id):
    pass

def post_comment_to_task(request: HttpRequest, task_id, comment):
    pass

def post_comment_to_daily_comment(request: HttpRequest, date, comment):
    pass

def post_peck(request: HttpRequest, task_id):
    pass


