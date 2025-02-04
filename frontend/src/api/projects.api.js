import client from "@api/client"

export const getProjectList = async () => {
    const res = await client.get("projects/")
    return res.data.results
}

export const getProjectListByUser = async (username) => {
    const res = await client.get(`users/@${username}/projects/`)
    return res.data.results
}

export const getProject = async (id) => {
    const res = await client.get(`projects/${id}`)
    return res.data
}

export const postProject = async (project) => {
    const res = await client.post("projects/", project)
    return res.status
}

export const patchProject = async (id, edit) => {
    const res = await client.patch(`projects/${id}`, edit)
    return res.data
}

export const deleteProject = async (id) => {
    const res = await client.delete(`projects/${id}`)
    return res.data
}
