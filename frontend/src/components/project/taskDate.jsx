const formatDate = (date) => {
    const formattedDate = `${date?.getFullYear()}년 ${date?.getMonth()+1}월 ${date?.getDate()}일`
    return formattedDate
}

const formatTime = (time) => {
    const formattedTime = `${time?.getHours()}시 ${time?.getMinutes()}분`
    return formattedTime
}

const taskDate = (task) => {
    const task_due = new Date(`${task.due_date}${task.due_time ? "T"+task.due_time : ""}`)
    const assigned_at_date = new Date(task.assigned_at)

    const formatted_due_date = formatDate(task_due)
    const formatted_due_time = formatTime(task_due)
    const formatted_assigned_date = formatDate(assigned_at_date)

    return {formatted_due_date, formatted_due_time, formatted_assigned_date}
}

export default taskDate