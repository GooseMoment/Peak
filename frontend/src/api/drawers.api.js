import client from "./client"

export const getDrawersByProject = async (project_id) => {
    try {
        const res = await client.get(`projects/${project_id}`)
        return res.data.drawers
    } catch (e) {
        throw e
    }
}

export const getDrawer = async (id) => {
    try {
        const res = await client.get(`drawers/${id}`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const postDrawer = async (drawer) => {
    try {
        const res = await client.post("drawers/", drawer)
        return res.status
    } catch (e) {
        throw e
    }
}

export const patchDrawer = async (id, edit) => {
    try {
        const res = await client.patch(`drawers/${id}`, edit)
        return res.data
    } catch (e) {
        throw e
    }

}

export const deleteDrawer = async (id) => {
    try {
        const res = await client.delete(`drawers/${id}`)
        return res.data
    } catch (e) {
        throw e
    }
}
