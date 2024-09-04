from django.db.models import F

def reorder_tasks(drawer_tasks, dragged_order, target_order):
    if dragged_order == target_order:
        return
    
    dragged_task = drawer_tasks.get(order=dragged_order)

    if dragged_order < target_order:
        tasks_to_shift = drawer_tasks.filter(order__lte=target_order)
        tasks_to_shift.update(order=F('order') - 1)
        dragged_task.order = target_order - 1
    elif dragged_order > target_order:
        tasks_to_shift = drawer_tasks.filter(order__gte=target_order)
        tasks_to_shift.update(order=F('order') + 1)
        dragged_task.order = target_order

    dragged_task.save()

def normalize_drawer_order(drawer_tasks):
    ordered_tasks = drawer_tasks.order_by('order')
    for idx, task in enumerate(ordered_tasks, start=0):
        if task.order != idx:
            task.order = idx
            task.save()
