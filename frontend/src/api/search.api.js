import client from "@api/client"

export const getSearchResults = async (filters, cursor) => {
    const searchParam = new URLSearchParams()

    Object.entries(filters).map(([filterName, filterBody]) => {
        if (filterBody.value && filterBody.type === "date") {
            searchParam.set(
                filterName,
                filterBody.value.startDate + "/" + filterBody.value.endDate,
            )
        } else {
            searchParam.set(filterName, filterBody.value)
        }
    })

    searchParam.set("cursor", cursor)

    const res = await client.get(`search/`, { params: searchParam })

    return res.data
}
