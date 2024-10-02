import client from "@api/client"

export const getTasksOverdue = async (filter_field, page) => {
    const res = await client.get(`today/overdue`, {
        params: { filter_field, page },
    })
    return res.data
}

export const getTasksAssignedToday = async (date, page) => {
    const res = await client.get(`today/assigned`, { params: { date, page } })
    return res.data
}

export const getTasksDueToday = async (date, page) => {
    const res = await client.get(`today/due`, { params: { date, page } })
    return res.data
}

export const getTasksTodayAssignedGrouped = async (tz) => {
    const res = await client.get(`tasks/today/assigned/grouped`, {
        params: { tz },
    })
    const items = res.data
    let countAll = 0

    for (const i in items) {
        countAll += items[i].count
    }

    return { items, countAll }
}
