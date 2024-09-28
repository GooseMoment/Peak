from rest_framework import mixins, status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

import datetime
from pytz import timezone as timezone_from_zone, NonExistentTimeError


class CreateMixin(mixins.CreateModelMixin):
    def create_with_user(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        for k, v in kwargs.items():
            serializer.validated_data[k] = v
        serializer.validated_data["user"] = request.user
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


# from https://stackoverflow.com/questions/4581789/how-do-i-get-user-ip-address-in-django ㅎㅎ
def get_client_ip(request: Request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@api_view(["GET"])
@permission_classes((AllowAny, ))
def get_healthcheck(request: Request):
    return Response({"data": "success", "ip": get_client_ip(request)})


class TimezoneMixin:
    TZ_HEADER = "Client-Timezone"

    def __init__(self, *args, **kwargs):
        self._tz = None
        self._now = None
        self._today_range = None

        super().__init__(*args, **kwargs)

    def get_tz(self):
        if self._tz is not None:
            return self._tz
        
        zone = self.request.headers.get(self.TZ_HEADER, "UTC")
        
        try:
            tz = timezone_from_zone(zone)
        except NonExistentTimeError:
            tz = datetime.UTC
        
        self._tz = tz
        return tz
    
    def get_now(self):
        if self._now is not None:
            return self._now
        
        tz = self.get_tz()
        now = datetime.datetime.now(tz=tz)

        self._now = now
        return now
    
    def get_today(self):
        return self.get_now().date()

    def get_today_range(self):
        if self._today_range is not None:
            return self._today_range
        
        tz = self.get_tz()
        today = self.get_today()

        today_min = datetime.datetime.combine(today, datetime.time.min, tz) 
        today_max = datetime.datetime.combine(today, datetime.time.max, tz) 

        today_range = (today_min, today_max)
        self._today_range = today_range

        return today_range

