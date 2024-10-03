import { useClientLocale } from "@utils/clientSettings"
import { useClientTimezone } from "@utils/clientSettings"

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
    const diff_months = date.month - today.month
    const diff_days = date.day - today.day
    const diff_due = date.diff(today, ["years", "months", "days"]).toObject()

    let newDate = null
    if (diff_years > 0) {
        newDate = date.toLocaleString(locale)
    } else {
        newDate = date.toLocaleString(locale, option)
    }

    let calculatedDue = ""
    if (!isSocial && (diff_years < 0 || diff_months < 0 || diff_days < 0)) {
        calculatedDue = name === "assigned" ? t("missed") : t("overdue")
        return [newDate, calculatedDue, true]
    } else if (diff_days === 0) {
        if ((name === "due_datetime") && (diff_due.days < 0)) {
            calculatedDue = t("overdue")
            return [newDate, calculatedDue, true]
        }
        calculatedDue = t("due_today")
    } else if (diff_days === 1) {
        calculatedDue = t("due_tomorrow")
    } else if (2 <= diff_days && diff_days <= 30) {
        calculatedDue = `${diff_days}` + t("days_left")
    } else {
        calculatedDue = newDate
    }

    return [newDate, calculatedDue, false]
}

const taskCalculation = (task, isSocial) => {
    const tz = useClientTimezone()

    const today = DateTime.fromJSDate(new Date()).setZone(tz)

    const taskAssigned_at = DateTime.fromJSDate(new Date(task.assigned_at)).setZone(tz)
    const [assigned, calculate_assigned, isOutOfAssigned] = calculateDate("assigned", taskAssigned_at, today, isSocial)

    let taskDue = null
    if (task.due_type === "due_date") {
        taskDue = DateTime.fromJSDate(new Date(task.due_date)).setZone(tz)
    } else if (task.due_type === "due_datetime") {
        taskDue = DateTime.fromJSDate(new Date(task.due_datetime)).setZone(tz)
    }
    const [due, calculate_due, isOutOfDue] = calculateDate(task.due_type, taskDue, today, isSocial)

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
