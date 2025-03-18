
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
        if task.order != idx:
            task.order = idx
            task.save()


def normalize_drawers_order(drawers, ordering):
    ordered_drawers = drawers.order_by(ordering)

    for idx, drawer in enumerate(ordered_drawers, start=0):
        if drawer.order != idx:
            drawer.order = idx
            drawer.save()
