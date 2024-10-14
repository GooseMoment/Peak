from datetime import timedelta

def caculateScheduled(task_due_datetime, delta):
    return task_due_datetime - timedelta(minutes=delta)
