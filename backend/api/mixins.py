import datetime
from pytz import timezone as timezone_from_zone, NonExistentTimeError


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

    def get_datetime_range(self, date: datetime.date):
        tz = self.get_tz()
        datetime_min = datetime.datetime.combine(date, datetime.time.min, tz) 
        datetime_max = datetime.datetime.combine(date, datetime.time.max, tz) 
        datetime_range = (datetime_min, datetime_max)

        return datetime_range

    def get_today_range(self):
        if self._today_range is not None:
            return self._today_range
        
        today = self.get_today()
        today_range = self.get_datetime_range(today)

        self._today_range = today_range
        return today_range
