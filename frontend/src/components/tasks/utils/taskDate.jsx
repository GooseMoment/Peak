import { useClientLocale, useClientSetting } from "@utils/clientSettings"

const taskDate = (task) => {
    const [setting, ] = useClientSetting()
    const locale = useClientLocale()

    const formatDate = (date) => {
        const formattedDate = date.toLocaleDateString(locale)
        return formattedDate
    }
    
    const formatTime = (time) => {
        let formattedTime = ''
        if (setting.time_as_24_hour)
            formattedTime = time.toLocaleTimeString(locale, {hour12: false, hour: "numeric", minute: "numeric"})
        else
            formattedTime = time.toLocaleTimeString(locale, {hour12: true, hour: "numeric", minute: "numeric"})
        return formattedTime
    }

    const task_due = new Date(`${task.due_date}${task.due_time ? "T"+task.due_time : ""}`)
    const assigned_at_date = new Date(task.assigned_at)
    const formatted_due_datetime = task.due_time ? formatDate(task_due) + ' ' + formatTime(task_due) : formatDate(task_due)
    const formatted_assigned_date = formatDate(assigned_at_date)

    return {formatted_due_datetime, formatted_assigned_date}
}

export default taskDate