import axios from "axios"

export const getTasksByDrawer = async (drawerID) => {
    try {
        const res = await axios.get(`tasks?drawer=${drawerID}`)
        return res.data.results
    } catch (e) {
        throw e
    }
}

export const getTask = async (id, isReactionIncluded) => {
    try {
        const res = await axios.get(`tasks/${id}`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const postTask = async (task) => {
    try {
        const res = await axios.post("tasks/", task)
        return res.status
    } catch (e) {
        throw e
    }
}

export const patchTask = async (id, edit) => {
    try {
        const res = await axios.patch(`tasks/${id}`, edit)
        return res.data
    } catch (e) {
        throw e
    }
}

export const deleteTask = async (id) => {
    try {
        const res = await axios.delete(`tasks/${id}`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const completeTask = async (id) => {
    const date = new Date();
    const edit = {
        "completed_at": date.toISOString()
    }
    return await patchTask(id, edit)
}