from rest_framework import mixins, generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Announcement, Heart
from .serializers import AnnouncementSerializer 

from api.permissions import IsUserMatch

class AnnouncementList(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = AnnouncementSerializer
    permission_classes = (AllowAny, )

    def get_queryset(self):
        return Announcement.objects.all().order_by("-created_at")

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class HeartExists(generics.GenericAPIView):
    permission_classes = (IsUserMatch, )

    def get_queryset(self):
        return Heart.objects.all()
    
    def get(self, request, username, announcement_id, *args, **kwargs):
        exists = self.get_queryset().filter(user__username=username, announcement=announcement_id).exists()

        if not exists:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)
    
    def post(self, request, username, announcement_id, *args, **kwargs):
        _, created = self.get_queryset().get_or_create(user__username=username, announcement=announcement_id)
        
        if created:
                return Response(status=status.HTTP_201_CREATED)
        
        return Response(status=status.HTTP_208_ALREADY_REPORTED)
