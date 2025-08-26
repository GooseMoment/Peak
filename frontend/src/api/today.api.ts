import client from "@api/client"
import type { PaginationData, UUID } from "@api/common"
import { Task } from "@api/tasks.api"

export interface TaskGrouped {
    id: UUID
    name: string
    color: string
    count: number
}

export const getTasksAssignedToday = async (date: string, page: string) => {
    const res = await client.get<PaginationData<Task>>(`today/assigned/`, {
        params: { date, page },
    })
    return res.data
}

export const getTasksTodayDue = async (page: string) => {
    const res = await client.get<PaginationData<Task>>(`today/todayDue/`, {
        params: { page },
    })
    return res.data
}

export const getTasksOverDue = async (page: string) => {
    const res = await client.get<PaginationData<Task>>(`today/overDue/`, {
        params: { page },
    })
    return res.data
}

export const getTasksPastAssigned = async (page: string) => {
    const res = await client.get<PaginationData<Task>>(`today/pastAssigned/`, {
        params: { page },
    })
    return res.data
}

export const getTasksTodayAssignedGrouped = async (tz: string) => {
    const res = await client.get<TaskGrouped[]>(`today/assigned/grouped/`, {
        params: { tz },
    })
    const items = res.data
    let countAll = 0

    for (const i in items) {
        countAll += items[i].count
    }

    return { items, countAll }
}
