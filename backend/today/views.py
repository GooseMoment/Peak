from rest_framework import mixins, generics
from rest_framework.pagination import PageNumberPagination

from api.permissions import IsUserMatch
from tasks.serializers import TaskSerializer
from tasks.models import Task

import datetime
from django.utils import timezone
from django.db.models import Q

class TaskTodayAssignedList(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsUserMatch]

    def get_queryset(self):
        date_isoformat = self.request.GET.get("date")
        date = datetime.date.fromisoformat(date_isoformat)

        today_assignment_tasks = Task.objects.filter(
            user=self.request.user,
            assigned_at=date,
            completed_at__isnull=True
        ).order_by("assigned_at").all()

        return today_assignment_tasks
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class TaskTodayDueListPagination(PageNumberPagination):
    page_size = 4
    
class TaskTodayDueList(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsUserMatch]
    pagination_class = TaskTodayDueListPagination

    def get_queryset(self):
        day = self.request.GET.get('day')
        day_min = datetime.datetime.fromisoformat(day)
        day_max = day_min + datetime.timedelta(hours=24) - datetime.timedelta(seconds=1)
        day_range = (day_min, day_max)

        today_due_tasks = Task.objects.filter(
            user=self.request.user,
            due_datetime__range=day_range,
            completed_at__isnull=True
        ).order_by("due_date").all()

        return today_due_tasks
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class TaskOverdueListPagination(PageNumberPagination):
    page_size = 4

class TaskOverdueList(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsUserMatch]
    pagination_class = TaskOverdueListPagination

    def get_queryset(self):
        day_min = timezone.now().replace(hour=15, minute=0, second=0, microsecond=0)
        day_max = day_min + datetime.timedelta(hours=24) - datetime.timedelta(seconds=1)
        day_range = (day_min, day_max)

        filter_field = self.request.GET.get('filter_field', 'due_date')

        now = timezone.now()
        if filter_field == 'assigned_at':
            filter_condition = {'assigned_at__lt': now}
        if filter_field == 'due_date':
            filter_condition = {'due_date__lt': now}

        overdue_tasks = Task.objects.filter(
            ~Q(assigned_at__range=day_range),
            user=self.request.user,
            **filter_condition,
            completed_at__isnull=True,
        ).order_by(filter_field).all()

        return overdue_tasks
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
