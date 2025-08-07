import client from "@api/client"
import type { Base, PaginationData, Privacy } from "@api/common"
import { Drawer } from "@api/drawers.api"
import { type TaskReminder } from "@api/notifications.api"

export interface Task extends Base {
    name: string
    user_id: string
    drawer: Drawer
    privacy: Privacy
    priority: number
    order: number
    completed_at: null | string
    assigned_at: null | string
    due_type: null | string
    due_date: null | string
    due_datetime: null | string
    reminders: TaskReminder[]
    memo: string
}

export const getTasksByDrawer = async (
    drawerID: number,
    ordering: string,
    page: number,
) => {
    const res = await client.get<PaginationData<Task>>(`tasks/`, {
        params: { drawer: drawerID, ordering, page },
    })
    return res.data.results
}

export const getTask = async (id: number) => {
    const res = await client.get<Task>(`tasks/${id}/`)
    return res.data
}

export const postTask = async (task: Partial<Task>) => {
    const res = await client.post<Task>("tasks/", task)
    return res.data
}

export const patchTask = async (id: number, edit: Partial<Task>) => {
    const res = await client.patch<Task>(`tasks/${id}/`, edit)
    return res.data
}

export const patchReorderTask = async (data: Partial<Task>) => {
    const res = await client.patch<Partial<Task>[]>(`tasks/reorder/`, data)
    return res.data
}

export const deleteTask = async (id: number) => {
    const res = await client.delete(`tasks/${id}/`)
    return res.status
}

export const completeTask = async (id: number) => {
    const date = new Date()
    const edit = {
        completed_at: date.toISOString(),
    }
    return await patchTask(id, edit)
}

export const uncompleteTask = async (id: number) => {
    const edit = {
        completed_at: null,
    }
    return await patchTask(id, edit)
}
