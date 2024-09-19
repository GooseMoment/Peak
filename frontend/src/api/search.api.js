import client, { getCurrentUsername } from "@api/client"

export const getSearchResults = async (query, cursor) => {
    console.log(`${query}`)
    const res = await client.get(`search/?${query}&cursor=${cursor}`)

    return res.data
}
