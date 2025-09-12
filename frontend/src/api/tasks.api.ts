import client from "@api/client"
import type { PaginationData, Privacy } from "@api/common"
import { type Drawer } from "@api/drawers.api"
import { type MinimalReminder } from "@api/notifications.api"

export type TaskDueStrict =
    | { due_type: null; due_date: null; due_datetime: null }
    | { due_type: "due_date"; due_date: string; due_datetime: null }
    | { due_type: "due_datetime"; due_date: null; due_datetime: string }

interface MinimalTaskBase {
    name?: string
    user_id?: string
    drawer: Drawer
    privacy?: Privacy
    priority: number
    order?: number
    completed_at?: null | string
    assigned_at?: null | string
    reminders?: MinimalReminder[]
    memo?: string
    created_at?: string
    updated_at?: string
    deleted_at?: null | string
}

export interface MinimalTaskNoDue {
    due_type: null
    due_date: null
    due_datetime: null
}

export interface MinimalTaskDueDate {
    due_type: "due_date"
    due_date: string
    due_datetime: null
}

export interface MinimalTaskDueDatetime {
    due_type: "due_datetime"
    due_date: null
    due_datetime: string
}

export type MinimalTask = MinimalTaskBase &
    (MinimalTaskNoDue | MinimalTaskDueDate | MinimalTaskDueDatetime)

export type MinimalTaskWithID = MinimalTask & { id: string }

export type Task = Required<MinimalTaskWithID>

interface TaskPostBase {
    name?: string
    drawer: string
    privacy?: Privacy
    priority: number
    completed_at?: null | string
    assigned_at?: null | string
    reminders?: MinimalReminder[]
    memo?: string
}

export type TaskPost = TaskPostBase &
    (MinimalTaskNoDue | MinimalTaskDueDate | MinimalTaskDueDatetime)

export type DemoMinimalTaskBase = Pick<
    MinimalTask,
    "name" | "completed_at" | "assigned_at" | "priority"
>

export type DemoMinimalTask = DemoMinimalTaskBase &
    (MinimalTaskNoDue | MinimalTaskDueDate | MinimalTaskDueDatetime)

export type TaskContent =
    | "assigned"
    | "due"
    | "reminder"
    | "priority"
    | "drawer"
    | "memo"

export const getTasksByDrawer = async (
    drawerID: string,
    ordering: string,
    page: string,
) => {
    const res = await client.get<PaginationData<Task>>(`tasks/`, {
        params: { drawer: drawerID, ordering, page },
    })
    return res.data
}

export const getTask = async (id: string) => {
    const res = await client.get<Task>(`tasks/${id}/`)
    return res.data
}

export const postTask = async (task: TaskPost) => {
    const res = await client.post<Task>("tasks/", task)
    return res.data
}

export const patchTask = async (id: string, edit: Partial<TaskPost>) => {
    const res = await client.patch<Task>(`tasks/${id}/`, edit)
    return res.data
}

export const patchReorderTask = async (data: Partial<Task>[]) => {
    const res = await client.patch<Partial<Task>[]>(`tasks/reorder/`, data)
    return res.data
}

export const deleteTask = async (id: string) => {
    const res = await client.delete(`tasks/${id}/`)
    return res.status
}

export const completeTask = async (id: string) => {
    const date = new Date()
    const edit = {
        completed_at: date.toISOString(),
    }
    return await patchTask(id, edit)
}

export const uncompleteTask = async (id: string) => {
    const edit = {
        completed_at: null,
    }
    return await patchTask(id, edit)
}
