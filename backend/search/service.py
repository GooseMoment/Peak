from django.db.models import Q, F, Value

from projects.models import Project
from drawers.models import Drawer
from tasks.models import Task
from .serializers import ProjectSearchSerializer, DrawerSearchSerializer, TaskSearchSerializer

SCOPE_BITMASK = {"task": 1, "drawer": 2, "project": 4}
SEARCH_PREVIEW_LIMIT = 4

def global_search(query, scope):
    results = dict()

    # TODO: global한 결과를 내놓기에 각 결과가 FK object 전체를 들고 오는 것보다 필요한 color만 쓰는 것이 낫다 판단함.
    # 검색 옵션에 따라 project, drawer object를 같이 반환하도록 하는 것을 고려
    # drawer serializer 참고
    targets = {
        "task": {"objects": Task.objects.select_related("drawer__project"), "serializer": TaskSearchSerializer},
        "drawer": {"objects": Drawer.objects.select_related("project"), "serializer": DrawerSearchSerializer},
        "project": {"objects": Project.objects, "serializer": ProjectSearchSerializer},
    }

    for key, value in targets.items():
        if scope & SCOPE_BITMASK[key]:
            query_set = value["objects"].filter(
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