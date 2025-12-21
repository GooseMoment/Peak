from django.db.models import Q, F, Value

from projects.models import Project
from drawers.models import Drawer
from tasks.models import Task
from .serializers import ProjectSearchSerializer, DrawerSearchSerializer, TaskSearchSerializer

SCOPE_BITMASK = {"task": 1, "drawer": 2, "project": 4}
SEARCH_PREVIEW_LIMIT = 4

def global_search(query, scope):
    results = dict()

    targets = {
        "task": {"model": Task, "serializer": TaskSearchSerializer},
        "drawer": {"model": Drawer, "serializer": DrawerSearchSerializer},
        "project": {"model": Project, "serializer": ProjectSearchSerializer},
    }

    for key, value in targets.items():
        if scope & SCOPE_BITMASK[key]:
            query_set = value["model"].objects.filter(
                Q(name__icontains=query)
            )
            count = query_set.count()
            
            if count > SEARCH_PREVIEW_LIMIT:
                query_set = query_set[:SEARCH_PREVIEW_LIMIT]

            data = value["serializer"](query_set, many=True).data
            results[key] = {"data": data, "count": count}
        else:
            results[key] = {"data": [], "count": 0}
    
    return results