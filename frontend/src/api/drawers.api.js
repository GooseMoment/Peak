import client from "@api/client"

export const getDrawersByProject = async (projectID, ordering) => {
    const res = await client.get(
        `drawers?project=${projectID}&ordering=${ordering}`,
    )
    return res.data.results
}

export const getDrawer = async (id) => {
    const res = await client.get(`drawers/${id}`)
    return res.data
}

export const postDrawer = async (drawer) => {
    const res = await client.post("drawers/", drawer)
    return res.status
}

export const patchDrawer = async (id, edit) => {
    const res = await client.patch(`drawers/${id}`, edit)
    return res.data
}

export const patchReorderDrawer = async (data) => {
    const res = await client.patch(`drawers/reorder`, data)
    return res.data
}

export const deleteDrawer = async (id) => {
    const res = await client.delete(`drawers/${id}`)
    return res.data
}
