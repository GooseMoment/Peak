export type TaskDueStrict =
    | { due_type: null; due_date: null; due_datetime: null }
    | { due_type: "due_date"; due_date: string; due_datetime: null }
    | { due_type: "due_datetime"; due_date: null; due_datetime: string }

export type TaskContent =
    | "assigned"
    | "due"
    | "reminder"
    | "priority"
    | "drawer"
    | "memo"
