import axios from "axios"

export const getProjectsList = async () => {
    try {
        const res = await axios.get("projects/")
        return res.data.results
    } catch (e) {
        throw e
    }
}

export const getProject = async (id) => {
    try {
        const res = await axios.get(`projects/${id}`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const postProject = async (project) => {
    try {
        const res = await axios.post("projects/", project)
        return res.status
    } catch (e) {
        throw e
    }
}

export const patchProject = async (id, edit) => {
    try {
        const res = await axios.patch(`projects/${id}`, edit)
        return res.data
    } catch (e) {
        throw e
    }
}

export const deleteProject = async (id) => {
    try {
        const res = await axios.delete(`projects/${id}`)
        return res.data
    } catch (e) {
        throw e
    }
}
