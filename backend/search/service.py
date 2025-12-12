from django.db.models import Q, F, Value

from projects.models import Project
from drawers.models import Drawer
from tasks.models import Task
from .serializers import ProjectSearchSerializer, DrawerSearchSerializer, TaskSearchSerializer

SCOPE_BITMASK = {"task": 1, "drawer": 2, "project": 4}

def global_search(query, scope):
    results = dict()

    targets = {
        "task": {"model": Task, "serializer": TaskSearchSerializer},
        "drawer": {"model": Drawer, "serializer": DrawerSearchSerializer},
        "project": {"model": Project, "serializer": ProjectSearchSerializer}
    }

    for scope, value in targets.items():
        if scope & SCOPE_BITMASK[scope]:
            query_set = value["model"].objects.filter(
                Q(name__icontains=query)
            )
            data = value["serializer"](query_set, many=True).data
            results[scope] = data
        else:
            results[scope] = []

    return results