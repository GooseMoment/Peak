import client from "@api/client"

export const getTasksOverdue = async (filter_field, day, page) => {
    const res = await client.get(`today/overdue?filter_field=${filter_field}&day=${day}&page=${page}`)
    return res.data
}

export const getTasksAssignedToday = async (day, page) => {
    const res = await client.get(`today/assigned?day=${day}&page=${page}`)
    return res.data
}

export const getTasksDueToday = async (day, page) => {
    const res = await client.get(`today/due?day=${day}&page=${page}`)
    return res.data
}
