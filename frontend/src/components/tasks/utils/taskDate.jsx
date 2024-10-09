import { useClientLocale, useClientSetting, useClientTimezone } from "@utils/clientSettings"
import { DateTime } from "luxon"

const taskDate = (task) => {
    const [setting] = useClientSetting()
    const locale = useClientLocale()
    const tz = useClientTimezone()

    const formatDate = (date) => {
        const formattedDate = date.setLocale(locale).toLocaleString()
        return formattedDate
    }

    const formatDateTime = (datetime) => {
        const formattedDateTime = datetime.setLocale(locale).toLocaleString({
            hour12: !setting.time_as_24_hour,
            dateStyle: "medium",
            timeStyle: "short",
        })
        return formattedDateTime
    }

    let formatted_due_datetime = null
    if (task.due_type === "due_date") {
        const task_due = DateTime.fromISO(task.due_date, { zone: tz })
        formatted_due_datetime = formatDate(task_due)
    } else {
        const task_due = DateTime.fromISO(task.due_datetime, { zone: tz })
        formatted_due_datetime = formatDateTime(task_due)
    }

    const assigned_at_date = DateTime.fromISO(task.assigned_at, { zone: tz })
    const formatted_assigned_date = formatDate(assigned_at_date)

    return { formatted_due_datetime, formatted_assigned_date }
}

export default taskDate
