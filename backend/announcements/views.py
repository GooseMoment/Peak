from rest_framework import mixins, generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from django.conf import settings
from datetime import datetime, UTC

from .models import Announcement, Heart
from .serializers import AnnouncementSerializer
from users.models import User


class AnnouncementList(generics.GenericAPIView):
    serializer_class = AnnouncementSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        return Announcement.objects.all().order_by("-created_at")

    def get(self, request, *args, **kwargs):
        lang = request.GET.get("lang", settings.LANGUAGE_CODE)
        pinned_only = request.GET.get("pinned_only", "false") == "true"

        now = datetime.now(UTC)
        queryset = self.get_queryset().filter(lang=lang)

        if pinned_only:
            queryset = queryset.filter(pinned_until__gte=now)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class AnnouncementDetail(mixins.RetrieveModelMixin, generics.GenericAPIView):
    serializer_class = AnnouncementSerializer
    lookup_field = "id"
    permission_classes = (AllowAny,)

    def get_queryset(self):
        return Announcement.objects.all()

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class HeartDetail(generics.GenericAPIView):
    def get_queryset(self):
        return Heart.objects.all()

    def get(self, request, announcement_id, username, *args, **kwargs):
        if request.user.username != username:
            return Response(status=status.HTTP_403_FORBIDDEN)

        exists = (
            self.get_queryset()
            .filter(user__username=username, announcement_id=announcement_id)
            .exists()
        )

        return Response(
            {
                "hearted": exists,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request, announcement_id, username, *args, **kwargs):
        if request.user.username != username:
            return Response(status=status.HTTP_403_FORBIDDEN)

        user = User.objects.get(username=username)

        _, created = self.get_queryset().get_or_create(
            user=user, announcement_id=announcement_id
        )

        if created:
            return Response(status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_208_ALREADY_REPORTED)

    def delete(self, request, announcement_id, username, *args, **kwargs):
        if request.user.username != username:
            return Response(status=status.HTTP_403_FORBIDDEN)

        filter = self.get_queryset().filter(
            user__username=username, announcement=announcement_id
        )

        if not filter.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)

        filter.delete()
        return Response(status=status.HTTP_200_OK)
