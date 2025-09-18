import { useMemo } from "react"

import type { DemoMinimalTask } from "@api/tasks.api"

import { useClientLocale } from "@utils/clientSettings"
import { useClientTimezone } from "@utils/clientSettings"

import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

type CalcDateResult = [string | null, string | null, boolean]

const useCalculateDate = (
    isAssigned: boolean,
    date: DateTime | null,
    today: DateTime,
    isSocial: boolean,
): CalcDateResult => {
    const { t } = useTranslation("translation", { keyPrefix: "task" })

    const locale = useClientLocale()

    return useMemo(() => {
        if (date === null) {
            return [null, null, false]
        }

        const diff_years = today.year - date.year
        const diff_total_days = Math.ceil(date.diff(today, "days").days)

        let newDate = null
        if (diff_years > 0) {
            newDate = date.setLocale(locale).toFormat("yyyy.MM.dd")
        } else {
            newDate = date.setLocale(locale).toFormat("MM.dd")
        }

        let calculatedDue = ""
        if (!isSocial && diff_total_days < 0) {
            calculatedDue = isAssigned ? t("missed") : t("overdue")
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
    }, [date, today, isSocial, isAssigned, locale, t])
}

const useTaskDateStatus = (task: DemoMinimalTask, isSocial: boolean) => {
    const tz = useClientTimezone()

    const today = DateTime.now().setZone(tz)

    const taskAssignedAt = task.assigned_at
        ? DateTime.fromISO(task.assigned_at, { zone: tz })
        : null

    const [assigned, calculate_assigned, isOutOfAssigned] = useCalculateDate(
        true,
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
    const [due, calculate_due, isOutOfDue] = useCalculateDate(
        false,
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

export default useTaskDateStatus
