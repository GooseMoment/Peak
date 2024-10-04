import client from "@api/client"

export const getSearchResults = async (filters, cursor) => {
    const searchparam = new URLSearchParams()

    Object.entries(filters).map(([filterName, filterBody]) => {
        if (filterBody.value && filterBody.type === "date") {
            searchparam.set(
                filterName,
                filterBody.value.startDate + "to" + filterBody.value.endDate,
            )
        } else {
            searchparam.set(filterName, filterBody.value)
        }
    })

    const res = await client.get(`search/?${searchparam}&cursor=${cursor}`)

    return res.data
}
