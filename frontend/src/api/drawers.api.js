import axios from "axios"

export const getDrawersByProject = async (project_id) => {
    try {
        const res = await axios.get(`projects/${id}`)
        return res.data.drawers
    } catch (e) {
        throw e
    }
}

export const getDrawer = async (id) => {
    try {
        const res = await axios.get(`drawers/${id}`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const postDrawer = async (drawer) => {
    try {
        const res = await axios.post("drawers/", drawer)
        return res.status
    } catch (e) {
        throw e
    }
}

export const patchDrawer = async (id, edit) => {
    try {
        const res = await axios.patch(`drawers/${id}`, edit)
        return res.data
    } catch (e) {
        throw e
    }

}

export const deleteDrawer = async (id) => {
    try {
        const res = await axios.delete(`drawers/${id}`)
        return res.data
    } catch (e) {
        throw e
    }
}
