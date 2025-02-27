export const initializeTask = (task) => {
    if (task && task.reminders?.length !== 0) {
        const deltaArray = task.reminders.map((reminder) => reminder.delta)
        return { ...task, reminders: deltaArray }
    }
    return task
}
