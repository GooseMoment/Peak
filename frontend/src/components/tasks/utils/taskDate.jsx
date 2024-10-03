import { useClientLocale, useClientSetting } from "@utils/clientSettings"

const taskDate = (task) => {
    const [setting] = useClientSetting()
    const locale = useClientLocale()

    const formatDate = (date) => {
        const formattedDate = date.toLocaleDateString(locale)
        return formattedDate
    }

    const formatDateTime = (datetime) => {
        let formattedDateTime = ""
        if (setting.time_as_24_hour)
            formattedDateTime = datetime.toLocaleString(locale, {
                hour12: false,
                dateStyle: "medium",
                timeStyle: "short",
            })
        else
            formattedDateTime = datetime.toLocaleString(locale, {
                hour12: true,
                dateStyle: "medium",
                timeStyle: "short",
            })
        return formattedDateTime
    }

    let formatted_due_datetime = null
    if (task.due_type === "due_date") {
        const task_due = new Date(task.due_date)
        formatted_due_datetime = formatDate(task_due)
    } else {
        const task_due = new Date(task.due_datetime)
        formatted_due_datetime = formatDateTime(task_due)
    }

    const assigned_at_date = new Date(task.assigned_at)
    const formatted_assigned_date = formatDate(assigned_at_date)

    return { formatted_due_datetime, formatted_assigned_date }
}

export default taskDate
