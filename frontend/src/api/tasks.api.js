import client from "./client"

export const getTasksByDrawer = async (drawerID) => {
    try {
        const res = await client.get(`tasks?drawer=${drawerID}`)
        return res.data.results
    } catch (e) {
        throw e
    }
}

export const getTask = async (id) => {
    try {
        const res = await client.get(`tasks/${id}`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const postTask = async (task) => {
    try {
        const res = await client.post("tasks/", task)
        return res.status
    } catch (e) {
        throw e
    }
}

export const patchTask = async (id, edit) => {
    try {
        const res = await client.patch(`tasks/${id}`, edit)
        return res.data
    } catch (e) {
        throw e
    }
}

export const deleteTask = async (id) => {
    try {
        const res = await client.delete(`tasks/${id}`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const completeTask = async (id) => {
    try {
        const date = new Date()
        const edit = {
            "completed_at": date.toISOString()
        }
        return await patchTask(id, edit)
    } catch (e) {
        throw e
    }
}

export const uncompleteTask = async (id) => {
    try {
        const edit = {
            "completed_at": null
        }
        return await patchTask(id, edit)
    } catch (e) {
        throw e
    }
}