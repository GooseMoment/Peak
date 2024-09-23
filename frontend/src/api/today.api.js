import client from "@api/client"

export const getOverdueTasks = async (filter_field, page) => {
    const res = await client.get(`today/overdue?filter_field=${filter_field}&page=${page}`)
    return res.data
}

export const getTodayAssignmentTasks = async (page) => {
    const res = await client.get(`today/assignment?page=${page}`)
    return res.data
}

export const getTodayDueTasks = async (page) => {
    const res = await client.get(`today/due?page=${page}`)
    return res.data
}
