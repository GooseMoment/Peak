import client from "@api/client"

export const getProjectList = async () => {
    try {
        const res = await client.get("projects/")
        return res.data.results
    } catch (e) {
        throw e
    }
}

export const getProjectListByUser = async (username) => {
    try {
        const res = await client.get(`users/@${username}/projects/`)
        return res.data.results
    } catch (e) {
        throw e
    }
}

export const getProject = async (id) => {
    try {
        const res = await client.get(`projects/${id}`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const postProject = async (project) => {
    try {
        const res = await client.post("projects/", project)
        return res.status
    } catch (e) {
        throw e
    }
}

export const patchProject = async (id, edit) => {
    try {
        const res = await client.patch(`projects/${id}`, edit)
        return res.data
    } catch (e) {
        throw e
    }
}

export const deleteProject = async (id) => {
    try {
        const res = await client.delete(`projects/${id}`)
        return res.data
    } catch (e) {
        throw e
    }
}
