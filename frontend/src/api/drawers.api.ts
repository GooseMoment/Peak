import client from "@api/client"
import type { Base, Privacy } from "@api/common"
import type { Project } from "@api/projects.api"
import type { User } from "@api/users.api"

export interface Drawer extends Base {
    name: string
    user: User
    project: Project
    privacy: Privacy
    order: number
    uncompleted_task_count: number
    completed_task_count: number
}

export interface DrawerCreate {
    name: string
    project: string
    privacy: Privacy
}

export const DrawerNameDuplicate = "DRAWER_NAME_DUPLICATE"
export const DrawerLimitExceeded = "DRAWER_LIMIT_EXCEEDED"

export const getDrawersByProject = async (
    projectID: string,
    ordering: string,
) => {
    const res = await client.get<Drawer[]>(`drawers/`, {
        params: { project: projectID, ordering: ordering },
    })
    return res.data
}

export const getAllDrawers = async () => {
    const res = await client.get<Drawer[]>("drawers/")
    return res.data
}

export const getDrawer = async (id: string | string) => {
    const res = await client.get<Drawer>(`drawers/${id}/`)
    return res.data
}

export const postDrawer = async (drawer: Partial<DrawerCreate>) => {
    const res = await client.post<Drawer>("drawers/", drawer)
    return res.data
}

export const patchDrawer = async (id: string, edit: Partial<DrawerCreate>) => {
    const res = await client.patch<Drawer>(`drawers/${id}/`, edit)
    return res.data
}

export const patchReorderDrawer = async (data: Partial<Drawer>[]) => {
    const res = await client.patch(`drawers/reorder/`, data)
    return res.data
}

export const deleteDrawer = async (id: string) => {
    const res = await client.delete(`drawers/${id}/`)
    return res.status
}
