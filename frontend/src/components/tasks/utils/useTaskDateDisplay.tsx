import { useCallback, useMemo } from "react"

import type { MinimalTask } from "@api/tasks.api"

import {
    useClientLocale,
    useClientSetting,
    useClientTimezone,
} from "@utils/clientSettings"

import { DateTime } from "luxon"

const useTaskDateDisplay = (task: MinimalTask) => {
    const [setting] = useClientSetting()
    const locale = useClientLocale()
    const tz = useClientTimezone()

    const formatDate = useCallback(
        (date: DateTime | null) => {
            if (date === null || !date.isValid) return null

            const formattedDate = date.setLocale(locale).toLocaleString()
            return formattedDate
        },
        [locale],
    )

    const formatDateTime = useCallback(
        (datetime: DateTime) => {
            const formattedDateTime = datetime
                .setLocale(locale)
                .toLocaleString({
                    hour12: !setting.time_as_24_hour,
                    dateStyle: "medium",
                    timeStyle: "short",
                })
            return formattedDateTime
        },
        [locale, setting.time_as_24_hour],
    )

    const { formatted_due_datetime, formatted_assigned_date } = useMemo(() => {
        let formatted_due_datetime = null
        if (task.due_type === "due_date") {
            const task_due = DateTime.fromISO(task.due_date, { zone: tz })
            formatted_due_datetime = formatDate(task_due)
        } else if (task.due_type === "due_datetime") {
            const task_due = DateTime.fromISO(task.due_datetime, { zone: tz })
            formatted_due_datetime = formatDateTime(task_due)
        }

        const assigned_at_date = task.assigned_at
            ? DateTime.fromISO(task.assigned_at, { zone: tz })
            : null
        const formatted_assigned_date = formatDate(assigned_at_date)

        return { formatted_due_datetime, formatted_assigned_date }
    }, [task, tz, locale, setting.time_as_24_hour])

    return { formatted_due_datetime, formatted_assigned_date }
}

export default useTaskDateDisplay
