from django.db.models import F
from django.core.exceptions import ObjectDoesNotExist

def reorder_tasks(drawer_tasks, dragged_order, target_order, closest_edge):
    if dragged_order == target_order:
        return
    
    try:
        dragged_task = drawer_tasks.get(order=dragged_order)
    except (ObjectDoesNotExist):
        pass
    else:
        dragged_task.order = target_order
        if dragged_order < target_order:
            tasks_to_shift = drawer_tasks.filter(order__lte=target_order)
            if (tasks_to_shift):
                tasks_to_shift.update(order=F('order') - 1)

            if closest_edge == "top":
                dragged_task.order = target_order - 1
            
        elif dragged_order > target_order:
            tasks_to_shift = drawer_tasks.filter(order__gte=target_order)
            if (tasks_to_shift):
                tasks_to_shift.update(order=F('order') + 1)

            if closest_edge == "bottom":
                dragged_task.order = target_order + 1

        dragged_task.save()

def normalize_drawer_order(drawer_tasks, ordering):
    # due_date과 due_datetime 중에 하나로 선택해야함
    if (ordering == "due_date"):
        ordered_tasks = drawer_tasks.order_by("assigned_at", "due_date", "due_datetime")
    elif (ordering == "-due_date"):
        ordered_tasks = drawer_tasks.order_by("-assigned_at", "-due_date", "-due_datetime")
    else:
        ordered_tasks = drawer_tasks.order_by(ordering)
    
    for idx, task in enumerate(ordered_tasks, start=0):
        if task.order != idx:
            task.order = idx
            task.save()
