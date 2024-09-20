import client from "@api/client"

export const getSearchResults = async (query, cursor) => {
    const res = await client.get(`search/?${query}&cursor=${cursor}`)

    return res.data
}
