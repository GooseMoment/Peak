import client from "@api/client"
import type { Base, PaginationData, Privacy } from "@api/common"
import type { User } from "@api/users.api"

import type { PaletteColorName } from "@assets/palettes"

export interface Project extends Base {
    name: string
    user: User
    order: number
    privacy: Privacy | null
    color: PaletteColorName
    type: ProjectType
    completed_task_count: number
    uncompleted_task_count: number
}

export type ProjectType = "inbox" | "regular" | "goal"

//export const getSearchResults = async (query: string, page: string) => {
export const getSearchResults = async (query: string) => {
    const search = query
    const res = await client.get(`search/`, {
        params: { search },
    })

    return res.data
}