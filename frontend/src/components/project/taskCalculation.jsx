import { DateTime } from "luxon"

const calculate = (name, newDate, diff) => {
    let calculatedDue = ''
    if (diff.years < 0 || diff.months < 0 || diff.days < -1) {
        calculatedDue = (name === "assigned") ? "놓침" : "기한 지남"
    }
    else if (-1 <= diff.days && diff.days < 0) {
        calculatedDue = "오늘 기한"
    }
    else if (0 <= diff.days && diff.days <= 1) {
        calculatedDue = "내일 기한"
    }
    else if (1 < diff.days && diff.days <= 30) {
        calculatedDue = `${Math.floor(diff.days)}일 남음`
    }
    else {
        calculatedDue = newDate
    }

    return calculatedDue
}

const taskCalculation = (task) => {
    const today = new Date()
    const task_due_time = new Date(`${task.due_date}${task.due_time ? "T"+task.due_time : ""}`)
    const assigned_at_date = new Date(task.assigned_at)
    
    const new_due_date = `${task_due_time.getMonth()+1}월 ${task_due_time.getDate()}일`
    const new_assigned_at_date = `${assigned_at_date.getMonth()+1}월 ${assigned_at_date.getDate()}일`
    
    const dtoday = DateTime.fromJSDate(today)
    const ddue = DateTime.fromJSDate(task_due_time)
    const dassigned = DateTime.fromJSDate(assigned_at_date)

    const diff_due = ddue.diff(dtoday, ["years", "months", "days"]).toObject()
    const diff_assigned = dassigned.diff(dtoday, ["years", "months", "days"]).toObject()

    let due = calculate("due", new_due_date, diff_due)
    let assigned = calculate("assigned", new_assigned_at_date, diff_assigned)

    return {assigned, due}
}

export default taskCalculation