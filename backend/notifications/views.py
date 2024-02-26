from django.http import HttpRequest, HttpResponse, JsonResponse
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework import mixins
from rest_framework import generics

from .models import Notification
from .response import NotificationsJSONResponse
from .serializers import NotificatonSerializer

@api_view(["GET"])
def get_notifications(request: Request, format=None):
    if not request.user.is_authenticated:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    notifications = Notification.objects.filter(user=request.user)
    pagniator = Paginator(notifications, 25)

    page_number = request.GET.get("page")
    page_obj = pagniator.get_page(page_number)

    serializer = NotificatonSerializer(page_obj.object_list, many=True)
    return Response(serializer.data)

@method_decorator(login_required, name="dispatch")
class NotificationDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificatonSerializer
    lookup_field = "id"

    def get(self, request, id, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, id, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)