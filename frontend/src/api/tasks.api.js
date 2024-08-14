import client from "@api/client"

export const getTasksByDrawer = async (drawerID, ordering, page) => {
    const res = await client.get(
        `tasks?drawer=${drawerID}&ordering=${ordering}&page=${page}`,
    )
    return res.data
}

export const getOverdueTasks = async (filter_field, page) => {
    const res = await client.get(`tasks/overdue?filter_field=${filter_field}&page=${page}`)
    return res.data
}

export const getTodayTasks = async (page) => {
    const res = await client.get(`tasks/today?page=${page}`)
    return res.data
}

export const getTask = async (id) => {
    const res = await client.get(`tasks/${id}`)
    return res.data
}

export const postTask = async (task) => {
    const res = await client.post("tasks/", task)
    return res.status
}

export const patchTask = async (id, edit) => {
    const res = await client.patch(`tasks/${id}`, edit)
    return res.data
}

export const deleteTask = async (id) => {
    const res = await client.delete(`tasks/${id}`)
    return res.data
}

export const completeTask = async (id) => {
    const date = new Date()
    const edit = {
        completed_at: date.toISOString(),
    }
    return await patchTask(id, edit)
}

export const uncompleteTask = async (id) => {
    const edit = {
        completed_at: null,
    }
    return await patchTask(id, edit)
}
