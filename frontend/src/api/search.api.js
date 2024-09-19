import client, { getCurrentUsername } from "@api/client"

export const getSearchResults = async (query) => {
    const res = await client.get(`search/?${query}`)

    return res.data
}
