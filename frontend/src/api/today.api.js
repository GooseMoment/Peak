import client from "@api/client"

export const getOverdueTasks = async (filter_field, page) => {
    const res = await client.get(`today/overdue?filter_field=${filter_field}&page=${page}`)
    return res.data
}

export const getTodayAssignmentTasks = async (day, page) => {
    const res = await client.get(`today/assignment?day=${day}&page=${page}`)
    return res.data
}

export const getTodayDueTasks = async (day, page) => {
    const res = await client.get(`today/due?day=${day}&page=${page}`)
    return res.data
}
