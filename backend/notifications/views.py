from django.http import HttpRequest, HttpResponse
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View

from .models import Notification
from .response import NotificationsJSONResponse

def get_notifications(request: HttpRequest):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    notifications = Notification.objects.filter(user=request.user)

    pagniator = Paginator(notifications, 25)

    page_number = request.GET.get("page")
    page_obj = pagniator.get_page(page_number)

    return NotificationsJSONResponse(page_obj.object_list)

@method_decorator(login_required, name="dispatch")
class NotificationView(View):
    def get(self, request: HttpRequest, noti_id: str):
        pass

    def delete(self, request: HttpRequest, noti_id: str):
        pass