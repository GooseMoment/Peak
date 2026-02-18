import client from "@api/client"
import type { Base, PaginationData, Privacy } from "@api/common"
import type { User } from "@api/users.api"

import type { PaletteColorName } from "@assets/palettes"
import { Project } from "@api/projects.api"
import { Drawer } from "@api/drawers.api"
import { Task } from "@api/tasks.api"

export interface DrawerSearchResult extends Drawer {
    color: PaletteColorName
}

export type TaskSearchResult = Task & {
    color: PaletteColorName
}

type ResultBlock<T> = {
    data: T[]
    count: number
}

export interface SearchResponse {
    project: ResultBlock<Project>
    drawer: ResultBlock<DrawerSearchResult>
    task: ResultBlock<TaskSearchResult>
}

export type ProjectType = "inbox" | "regular" | "goal"

//export const getGlobalSearchResults = async (query: string, page: string) => {
export const getGlobalSearchResults = async (query: string) => {
    const keyword = query
    const res = await client.get<SearchResponse>(`search/`, {
        params: { keyword },
    })

    return res.data
}