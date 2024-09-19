from rest_framework import status, mixins, generics
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import CursorPagination
from rest_framework.permissions import AllowAny

from django.http import HttpRequest
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.db.models import Q, F

from datetime import datetime

from .serializers import *
from api.models import PrivacyMixin
from tasks.models import Task

from tasks.serializers import TaskSerializer

#####FILTERS####
SEARCH_TERMS_FILTER = 'searchTerms'
PROJECT_FILTER = 'project'
DRAWER_FILTER = 'drawer'
ASSIGNED_FILTER = 'assignedAt'
COMPLETED_FILTER = 'completedAt'
PRIVACY_FILTER = 'privacy'
MEMO_FILTER = 'memo'

def assigned_filter(value):
    value = value.split('to')

    if len(value) == 2:
        start_date = datetime.fromisoformat(value[0])
        end_date = datetime.fromisoformat(value[1])
        
        return Q(assigned_at__range=(start_date, end_date))
    
    pass

def completed_filter(value):
    value = value.split('to')
    
    if len(value) == 2:
        start_date = datetime.fromisoformat(value[0])
        end_date = datetime.fromisoformat(value[1])
        
        return Q(assigned_at__range=(start_date, end_date))
    
    pass

def privacy_filter(value):
    if value not in [PrivacyMixin.FOR_PRIVATE, PrivacyMixin.FOR_PROTECTED, PrivacyMixin.FOR_PUBLIC]:
        return 0
    
    return Q(privacy=value)

FILTERS = {
    SEARCH_TERMS_FILTER: lambda value: Q(name__icontains=value),
    PROJECT_FILTER: lambda value: Q(drawer__project__name__icontains=value),
    DRAWER_FILTER: lambda value: Q(drawer__name__icontains=value),
    ASSIGNED_FILTER: assigned_filter,
    COMPLETED_FILTER: completed_filter,
    PRIVACY_FILTER: privacy_filter,
    MEMO_FILTER: lambda value: Q(memo__icontains=value),
}
###############

class SearchPagination(CursorPagination):
    page_size = 10
    ordering = "-created_at"

class SearchView(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = SearchResultsSerializer
    pagination_class = SearchPagination
    
    def get_queryset(self):
        query_filter = Q(user=self.request.user)
        
        for param, query in FILTERS.items():
            value = self.request.GET.get(param, '')
            
            if not value or value == 'null':
                continue
            
            query_filter &= query(value)
            
        tasks_queryset = Task.objects.filter(query_filter).annotate(
            color=F('drawer__project__color'),
        )

        return tasks_queryset
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)