import client from "@api/client"

export const getTasksByDrawer = async (drawerID, ordering, page) => {
    const res = await client.get(`tasks/`, {
        params: { drawer: drawerID, ordering, page },
    })
    return res.data
}

export const getTask = async (id) => {
    const res = await client.get(`tasks/${id}/`)
    return res.data
}

export const postTask = async (task) => {
    const res = await client.post("tasks/", task)
    return res.data
}

export const patchTask = async (id, edit) => {
    const res = await client.patch(`tasks/${id}/`, edit)
    return res.data
}

export const patchReorderTask = async (data) => {
    const res = await client.patch(`tasks/reorder`, data)
    return res.data
}

export const deleteTask = async (id) => {
    const res = await client.delete(`tasks/${id}/`)
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
