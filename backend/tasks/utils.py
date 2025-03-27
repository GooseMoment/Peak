from .models import Task

def normalize_tasks_order(drawer_tasks, ordering):
    if ordering == "due_date":
        ordered_tasks = drawer_tasks.order_by("assigned_at", "due_date", "due_datetime")
    elif ordering == "-due_date":
        ordered_tasks = drawer_tasks.order_by(
            "-assigned_at", "-due_date", "-due_datetime"
        )
    else:
        ordered_tasks = drawer_tasks.order_by(ordering)

    for idx, task in enumerate(ordered_tasks, start=0):
        task.order = idx

    Task.objects.bulk_update(ordered_tasks, ['order'])
