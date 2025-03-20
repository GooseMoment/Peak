import client from "@api/client"

export const getTasksAssignedToday = async (date, page) => {
    const res = await client.get(`today/assigned/`, { params: { date, page } })
    return res.data
}

export const getTasksTodayDue = async (page) => {
    const res = await client.get(`today/todayDue/`, { params: { page } })
    return res.data
}

export const getTasksOverDue = async (page) => {
    const res = await client.get(`today/overDue/`, { params: { page } })
    return res.data
}

export const getTasksPastAssigned = async (page) => {
    const res = await client.get(`today/pastAssigned/`, { params: { page } })
    return res.data
}

export const getTasksTodayAssignedGrouped = async (tz) => {
    const res = await client.get(`today/assigned/grouped/`, {
        params: { tz },
    })
    const items = res.data
    let countAll = 0

    for (const i in items) {
        countAll += items[i].count
    }

    return { items, countAll }
}
