from django.http import HttpRequest, Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404

from .models import *
from .serializers import *
from users.serializers import UserSerializer

# following 만드는 거
class FollowView(APIView):
    #request
    def put(self, request, follower, followee):
        followerUser = get_object_or_404(User, username=follower)
        followeeUser = get_object_or_404(User, username=followee)

        try:
            created = Following.objects.create(follower=followerUser, followee=followeeUser)
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
        following.is_request = False
        following.save()
        return Response(status=status.HTTP_202_ACCEPTED)
    
    def delete(self, request, follower, followee):
        following = get_object_or_404(Following, follower__username=follower, followee__username=followee)
        #soft delete
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

def get_profile(request: HttpRequest, user_id):
    pass

def get_blocks(request: HttpRequest):
    pass

def post_block(request: HttpRequest, user_id):
    pass

def delete_block(request: HttpRequest, user_id):
    pass

def get_daily_report(request: HttpRequest, user_id, date):
    pass

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


