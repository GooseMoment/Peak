/* eslint-disable react-hooks/rules-of-hooks */
// TODO: remove eslint-disable after merging #523
import { useClientLocale, useClientTimezone } from "@utils/clientSettings"

import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

const calculateDate = (name, date, today, isSocial) => {
    const { t } = useTranslation(null, { keyPrefix: "task" })

    const locale = useClientLocale()
    const option = { day: "numeric", month: "numeric" }

    if (date === null) {
        return [null, null, null]
    }

    const diff_years = date.year - today.year
    const diff_total_days = Math.ceil(date.diff(today, "days").days)

    let newDate = null
    if (diff_years > 0) {
        newDate = date.toLocaleString(locale)
    } else {
        newDate = date.toLocaleString(locale, option)
    }

    let calculatedDue = ""
    if (!isSocial && diff_total_days < 0) {
        calculatedDue = name === "assigned" ? t("missed") : t("overdue")
        return [newDate, calculatedDue, true]
    } else if (diff_total_days === 0) {
        calculatedDue = t("due_today")
    } else if (diff_total_days === 1) {
        calculatedDue = t("due_tomorrow")
    } else if (2 <= diff_total_days && diff_total_days <= 30) {
        calculatedDue = `${diff_total_days}` + t("days_left")
    } else {
        calculatedDue = newDate
    }

    return [newDate, calculatedDue, false]
}

const taskCalculation = (task, isSocial) => {
    const tz = useClientTimezone()

    const today = DateTime.now().setZone(tz)

    const taskAssignedAt = DateTime.fromISO(task.assigned_at, { zone: tz })
    const [assigned, calculate_assigned, isOutOfAssigned] = calculateDate(
        "assigned",
        taskAssignedAt,
        today,
        isSocial,
    )

    let taskDue = null
    if (task.due_type === "due_date") {
        taskDue = DateTime.fromISO(task.due_date, { zone: tz })
    } else if (task.due_type === "due_datetime") {
        taskDue = DateTime.fromISO(task.due_datetime, { zone: tz })
    }
    const [due, calculate_due, isOutOfDue] = calculateDate(
        task.due_type,
        taskDue,
        today,
        isSocial,
    )

    return {
        due,
        assigned,
        calculate_due,
        calculate_assigned,
        isOutOfDue,
        isOutOfAssigned,
    }
}

export default taskCalculation
