import client from "@api/client"
import type { PaginationData, Privacy } from "@api/common"
import type { Drawer } from "@api/drawers.api"
import type { TaskReminderDelta } from "@api/notifications.api"
import type { User } from "@api/users.api"

interface MinimalTaskWithoutDue {
    name?: string
    user?: User
    drawer: Drawer
    privacy?: Privacy | null
    priority: number
    order?: number
    completed_at?: null | string
    assigned_at?: null | string
    reminders?: TaskReminderDelta[]
    memo?: string
    created_at?: string
    updated_at?: string
    deleted_at?: null | string
}

export interface DueNone {
    due_type: null
    due_date: null
    due_datetime: null
}

export interface DueDate {
    due_type: "due_date"
    due_date: string
    due_datetime: null
}

export interface DueDatetime {
    due_type: "due_datetime"
    due_date: null
    due_datetime: string
}

export type Due = DueNone | DueDate | DueDatetime

export type MinimalTask = MinimalTaskWithoutDue & Due

export type MinimalTaskWithID = MinimalTask & { id: string }

export type Task = Required<MinimalTaskWithID>

interface TaskPostBase {
    name?: string
    drawer: string
    privacy?: Privacy | null
    priority: number
    completed_at?: null | string
    assigned_at?: null | string
    reminders?: TaskReminderDelta[]
    memo?: string
}

export type TaskPost = TaskPostBase & Due

export type DemoMinimalTaskBase = Pick<
    MinimalTask,
    "name" | "completed_at" | "assigned_at" | "priority"
>

export type DemoMinimalTask = DemoMinimalTaskBase & Due

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
    const res = await client.patch(`tasks/reorder/`, data)
    return res.status
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
