import client from "@api/client"

export const getSearchResults = async (filters, cursor) => {
    const searchParam = new URLSearchParams()

    Object.entries(filters).map(([filterName, filterBody]) => {
        if (filterBody.value && filterBody.type === 'date') {
            console.log(filterBody.value)
            searchParam.set(
                filterName,
                filterBody.value.startDate + '/' + filterBody.value.endDate,
            )
        } else {
            searchParam.set(filterName, filterBody.value)
        }
    })

    searchParam.set("cursor", cursor)  

    console.log(`search/?params=${searchParam}`)

    const res = await client.get(`search/`, { params: searchParam })

    return res.data
}
