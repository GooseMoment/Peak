import type { Due } from "@api/tasks.api"

import { getClientTimezone } from "@utils/clientSettings"

import { DateTime } from "luxon"

const dueNone: Due = {
    due_type: null,
    due_date: null,
    due_datetime: null,
}

export const addAssignedDateFromToday = (
    set: { days: number } | { months: number } | null,
): string | null => {
    if (!set) {
        return null
    }

    const tz = getClientTimezone()
    return DateTime.now().setZone(tz).plus(set).toISODate()
}

export const addDueFromToday = (
    set: { days: number } | { months: number } | null,
): Due => {
    if (!set) return dueNone

    const tz = getClientTimezone()
    const date = DateTime.now().setZone(tz).plus(set).toISODate()

    if (date === null) return dueNone

    return {
        due_type: "due_date",
        due_date: date,
        due_datetime: null,
    }
}
