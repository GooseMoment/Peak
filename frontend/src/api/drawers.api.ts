import client from "@api/client"
import type { Base, PaginationData, Privacy } from "@api/common"
import type { Project } from "@api/projects.api"

export interface Drawer extends Base {
    name: string
    user_id: string
    project: Project
    privacy: Privacy
    order: number
    uncompleted_task_count: number
    completed_task_count: number
}

export interface DrawerCreateInput {
    name: string
    project: string
    privacy: Privacy
}

export const getDrawersByProject = async (
    projectID: string,
    ordering: string,
) => {
    const res = await client.get<PaginationData<Drawer>>(`drawers/`, {
        params: { project: projectID, ordering: ordering },
    })
    return res.data
}

export const getAllDrawers = async (page: string) => {
    const res = await client.get<PaginationData<Drawer>>("drawers/", {
        params: { page },
    })
    return res.data
}

export const getDrawer = async (id: string | string) => {
    const res = await client.get<Drawer>(`drawers/${id}/`)
    return res.data
}

export const postDrawer = async (drawer: Partial<DrawerCreateInput>) => {
    const res = await client.post<Drawer>("drawers/", drawer)
    return res.data
}

export const patchDrawer = async (id: string, edit: Partial<Drawer>) => {
    const res = await client.patch<Drawer>(`drawers/${id}/`, edit)
    return res.data
}

export const patchReorderDrawer = async (data: Partial<Drawer>[]) => {
    const res = await client.patch<Partial<Drawer>[]>(`drawers/reorder/`, data)
    return res.data
}

export const deleteDrawer = async (id: string) => {
    const res = await client.delete(`drawers/${id}/`)
    return res.status
}
