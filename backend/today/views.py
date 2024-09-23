from rest_framework import mixins, generics
from rest_framework.pagination import PageNumberPagination

from api.permissions import IsUserMatch
from tasks.serializers import TaskSerializer
from tasks.models import Task

import pytz
from django.utils import timezone
from django.db.models import Q

class TodayAssignmentTaskList(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsUserMatch]

    def get_queryset(self):
        now = timezone.now()
        today_start = timezone.datetime.combine(now.date(), timezone.datetime.min.time(), tzinfo=timezone.get_current_timezone())
        today_end = timezone.datetime.combine(now.date(), timezone.datetime.max.time(), tzinfo=timezone.get_current_timezone())

        today_assignment_tasks = Task.objects.filter(
            Q(user=self.request.user),
            Q(assigned_at__gte=today_start, assigned_at__lte=today_end),
            Q(completed_at__isnull=True)
        ).order_by("assigned_at").all()

        return today_assignment_tasks
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class TodayDueTaskListPagination(PageNumberPagination):
    page_size = 4
    
class TodayDueTaskList(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsUserMatch]
    pagination_class = TodayDueTaskListPagination

    def get_queryset(self):
        now = timezone.now()
        today_start = timezone.datetime.combine(now.date(), timezone.datetime.min.time(), tzinfo=timezone.get_current_timezone())
        today_end = timezone.datetime.combine(now.date(), timezone.datetime.max.time(), tzinfo=timezone.get_current_timezone())

        today_due_tasks = Task.objects.filter(
            Q(user=self.request.user),
            Q(due_date__gte=today_start, due_date__lte=today_end),
            Q(completed_at__isnull=True)
        ).order_by("due_date").all()

        return today_due_tasks
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class OverdueTaskListPagination(PageNumberPagination):
    page_size = 4

class OverdueTaskList(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsUserMatch]
    pagination_class = OverdueTaskListPagination

    def get_queryset(self):
        filter_field = self.request.GET.get('filter_field', 'due_date')

        now = timezone.now()
        if filter_field == 'assigned_at':
            filter_condition = {'assigned_at__lt': now}
        if filter_field == 'due_date':
            filter_condition = {'due_date__lt': now}

        overdue_tasks = Task.objects.filter(
            user=self.request.user,
            **filter_condition,
            completed_at__isnull=True
        ).order_by(filter_field).all()

        return overdue_tasks
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
