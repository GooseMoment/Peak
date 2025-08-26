import client from "@api/client"
import type { Base, PaginationData, Privacy } from "@api/common"

import type { PaletteColorName } from "@assets/palettes"

export interface Project extends Base {
    name: string
    user_id: string
    order: number
    privacy: Privacy
    color: PaletteColorName
    type: ProjectType
    completed_task_count: number
    uncompleted_task_count: number
}

export type ProjectType = "inbox" | "regular" | "goal"

export const getProjectList = async (page: string) => {
    const res = await client.get<PaginationData<Project>>("projects/", {
        params: { page },
    })
    return res.data
}

export const getProjectListByUser = async (username: string) => {
    const res = await client.get<PaginationData<Project>>(
        `users/@${username}/projects/`,
    )
    return res.data
}

export const getProject = async (id: string) => {
    const res = await client.get<Project>(`projects/${id}/`)
    return res.data
}

export const postProject = async (project: Partial<Project>) => {
    const res = await client.post<Project>("projects/", project)
    return res.data
}

export const patchProject = async (id: string, edit: Partial<Project>) => {
    const res = await client.patch<Project>(`projects/${id}/`, edit)
    return res.data
}

export const patchReorderProject = async (data: Partial<Project>[]) => {
    const res = await client.patch<Partial<Project>[]>(
        `projects/reorder/`,
        data,
    )
    return res.data
}

export const deleteProject = async (id: string) => {
    const res = await client.delete(`projects/${id}/`)
    return res.status
}
