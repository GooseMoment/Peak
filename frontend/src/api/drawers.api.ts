import client from "@api/client"
import type { Base, PaginationData, Privacy } from "@api/common"
import { Project } from "@api/projects.api"

export interface Drawer extends Base {
    name: string
    user_id: string
    project: Project
    privacy: Privacy
    order: number
    uncompleted_task_count: number
    completed_task_count: number
}

export const getDrawersByProject = async (
    projectID: number,
    ordering: string,
) => {
    const res = await client.get<PaginationData<Drawer>>(`drawers/`, {
        params: { project: projectID, ordering: ordering },
    })
    return res.data.results
}

export const getDrawer = async (id: number | string) => {
    const res = await client.get<Drawer>(`drawers/${id}/`)
    return res.data
}

export const postDrawer = async (drawer: Partial<Drawer>) => {
    const res = await client.post<Drawer>("drawers/", drawer)
    return res.data
}

export const patchDrawer = async (id: number, edit: Partial<Drawer>) => {
    const res = await client.patch<Drawer>(`drawers/${id}/`, edit)
    return res.data
}

export const patchReorderDrawer = async (data: Partial<Drawer>) => {
    const res = await client.patch<Partial<Drawer>[]>(`drawers/reorder/`, data)
    return res.data
}

export const deleteDrawer = async (id: number) => {
    const res = await client.delete(`drawers/${id}/`)
    return res.status
}
