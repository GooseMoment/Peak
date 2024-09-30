from rest_framework import mixins, generics
from rest_framework.pagination import PageNumberPagination

from api.permissions import IsUserMatch
from api.mixins import TimezoneMixin
from tasks.serializers import TaskSerializer
from tasks.models import Task

import datetime
from django.db.models import Q

class TaskTodayAssignedList(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsUserMatch]

    def get_queryset(self):
        date_isoformat = self.request.GET.get("date") # e.g. "2024-09-29"
        date = datetime.date.fromisoformat(date_isoformat)

        today_assignment_tasks = Task.objects.filter(
            user=self.request.user,
            assigned_at=date,
            completed_at__isnull=True
        ).order_by("-priority", "due_date").all()

        return today_assignment_tasks
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class TaskTodayDueListPagination(PageNumberPagination):
    page_size = 4
    
class TaskTodayDueList(mixins.ListModelMixin, TimezoneMixin, generics.GenericAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsUserMatch]
    pagination_class = TaskTodayDueListPagination

    def get_queryset(self):
        date_isoformat = self.request.GET.get("date") # e.g. "2024-09-28"
        date = datetime.date.fromisoformat(date_isoformat)
        # comment out below after adding a 'due_datetime' field instead of the method
        # datetime_range = self.get_datetime_range(date)

        today_due_tasks = Task.objects.filter(
            # comment out two lines right below after adding a 'due_datetime' field instead of the method
            Q(due_date=date), # |
            # Q(due_datetime__range=datetime_range), 
            user=self.request.user,
            completed_at__isnull=True
        ).order_by("due_date").all()

        return today_due_tasks
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class TaskOverdueListPagination(PageNumberPagination):
    page_size = 4

class TaskOverdueList(mixins.ListModelMixin, TimezoneMixin, generics.GenericAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsUserMatch]
    pagination_class = TaskOverdueListPagination

    def get_queryset(self):
        filter_field = self.request.GET.get('filter_field', 'due_date')

        # comment out below after adding a 'due_datetime' field instead of the method
        # now = self.get_now()
        today = self.get_today()

        if filter_field == "assigned_at":
            filter_condition = {"assigned_at__lt": today}
        if filter_field == "due_date":
            # comment out below after adding a 'due_datetime' field instead of the method
            filter_condition = {"due_date__lt": today, } # "due_datetime__lt": now} 

        overdue_tasks = Task.objects.filter(
            user=self.request.user,
            **filter_condition,
            completed_at__isnull=True,
        ).exclude(
            assigned_at=today,
        ).order_by(filter_field).all()

        return overdue_tasks
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
