from django.http import HttpRequest, Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.views import View
from django.utils import timezone
from django.shortcuts import get_object_or_404

from .models import *
from .serializers import *

# class FollowView(APIView):
#     def get_object(self, pk):
#         try:
#             return Following.objects.get(pk=pk)
#         except Following.DoesNotExist:
#             raise Http404

#     def get(self, request, pk, format=None):
#         following = self.get_object(pk)
#         serializer = FollowingSerializer(following)
#         return Response(serializer.data)

#     def put(self, request, pk, format=None):
#         following = self.get_object(pk)
#         serializer = FollowingSerializer(following, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk, format=None):
#         following = self.get_object(pk)
#         following.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

class FollowView(APIView):
    def put(self, request, follower, followee):
        following, created = Following.objects.get_or_create(follower=follower, followee=followee)
        if created:
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_208_ALREADY_REPORTED)

    def get(self, request, follower, followee):
        following = get_object_or_404(Following, follower=follower, followee=followee)
        serializer = FollowingSerializer(following)
        return Response(serializer, status=status.HTTP_200_OK)

    def patch(self, request, follower, followee):
        following = get_object_or_404(Following, follower=follower, followee=followee)
        following.is_request = False
        following.save()
        return Response(status=status.HTTP_202_ACCEPTED)

def post_follow_request(request: HttpRequest, user_id):
    pass

def patch_follow_request(request: HttpRequest, user_id):
    pass

def delete_follow_request(request: HttpRequest, user_id):
    pass

def get_profile(request: HttpRequest, user_id):
    pass

def get_followers(request: HttpRequest, user_id):
    pass

def get_followings(request: HttpRequest, user_id):
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


