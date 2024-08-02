import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"
import { useClientLocale } from "@utils/clientSettings"

const calculate = (name, newDate, diff) => {
    const { t } = useTranslation(null, {keyPrefix: "task"})
    
    let calculatedDue = ''
    if (diff.years < 0 || diff.months < 0 || diff.days < -1) {
        calculatedDue = (name === "assigned") ? t("missed") : t("overdue")
    }
    else if (-1 <= diff.days && diff.days < 0) {
        calculatedDue = t("due_today")
    }
    else if (0 <= diff.days && diff.days <= 1) {
        calculatedDue = t("due_tomorrow")
    }
    else if (1 < diff.days && diff.days <= 30) {
        calculatedDue = `${Math.floor(diff.days)}` + t("days_left")
    }
    else {
        calculatedDue = newDate
    }

    return calculatedDue
}

const taskCalculation = (task) => {
    const locale = useClientLocale()
    const option = { day: 'numeric', month: 'numeric' }

    const today = new Date()
    const task_due_time = new Date(`${task.due_date}${task.due_time ? "T"+task.due_time : ""}`)
    const assigned_at_date = new Date(task.assigned_at)
    
    const dtoday = DateTime.fromJSDate(today)
    const ddue = DateTime.fromJSDate(task_due_time)
    const dassigned = DateTime.fromJSDate(assigned_at_date)

    const diff_due = ddue.diff(dtoday, ["years", "months", "days"]).toObject()
    const diff_assigned = dassigned.diff(dtoday, ["years", "months", "days"]).toObject()

    let new_due_date = task_due_time.toLocaleDateString(locale, option)
    if (today.getFullYear() - task_due_time.getFullYear() > 0) {
        new_due_date = task_due_time.toLocaleDateString(locale)
    }
    let new_assigned_at_date = assigned_at_date.toLocaleDateString(locale, option)
    if (today.getFullYear() - assigned_at_date.getFullYear() > 0) {
        new_assigned_at_date = assigned_at_date.toLocaleDateString(locale)
    }

    let due = new_due_date
    let assigned = new_assigned_at_date

    let calculate_due = calculate("due", new_due_date, diff_due)
    let calculate_assigned = calculate("assigned", new_assigned_at_date, diff_assigned)

    return {due, assigned, calculate_due, calculate_assigned}
}

export default taskCalculation