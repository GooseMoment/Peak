from datetime import datetime, time
from pytz import timezone

def combine_due_datetime(due_tz, due_date, due_time):
    if (due_time == None):
        due_time = time(0, 0, 0)
    due = datetime.combine(due_date, due_time)
    tz = timezone(due_tz)
    return tz.localize(due)
