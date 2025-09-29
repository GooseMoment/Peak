import type { Due } from "@api/tasks.api"

import { getClientTimezone } from "@utils/clientSettings"

import { DateTime } from "luxon"

export const addAssignedDateFromToday = (
    set: { days: number } | { months: number } | null,
) => {
    if (!set) {
        return null
    }

    const tz = getClientTimezone()
    return DateTime.now().setZone(tz).plus(set).toISODate()
}

export const addDueFromToday = (
    set: { days: number } | { months: number } | null,
): Due => {
    if (!set) {
        return {
            due_type: null,
            due_date: null,
            due_datetime: null,
        }
    }

    const tz = getClientTimezone()
    const date = DateTime.now().setZone(tz).plus(set).toISODate()

    if (date === null) {
        return {
            due_type: null,
            due_date: null,
            due_datetime: null,
        }
    }

    return {
        due_type: "due_date",
        due_date: date,
        due_datetime: null,
    }
}
