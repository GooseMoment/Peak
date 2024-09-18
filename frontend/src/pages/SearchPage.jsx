import { useState } from "react"
import { useSearchParams } from "react-router-dom"

import PageTitle from "@components/common/PageTitle"
import FilterGroup from "@components/search/FilterGroup"
import SearchBar from "@components/search/SearchBar"

const initialFilterGroup = {
    project: {
        name: "Project",
        type: "text",
        value: null,
    },
    drawer: {
        name: "Drawer",
        type: "text",
        value: null,
    },
    assignedAt: {
        name: "Assign",
        type: "date",
        value: null,
    },
    completedAt: {
        name: "Completed",
        type: "date",
        value: null,
    },
    privacy: {
        name: "Privacy",
        type: "text",
        value: null,
    },
    memo: {
        name: "Memo",
        type: "text",
        value: null,
    },
}

const SearchPage = () => {
    const [filters, setFilters] = useState(initialFilterGroup)

    const [searchParams, setSearchParams] = useSearchParams()

    const updateSearchParams = (isEditSearchQuery) => (searchQuery) => {
        const recentFilters = isEditSearchQuery ? filters : searchQuery

        const newParams = new URLSearchParams(searchParams)

        if (isEditSearchQuery) newParams.set("searchTerm", searchQuery)

        Object.entries(recentFilters).forEach(([key, body]) => {
            if (body.value && body.type === "date") {
                newParams.set(
                    key,
                    body.value.startDate + "to" + body.value.endDate,
                )
            } else {
                newParams.set(key, body.value)
            }
        })

        setSearchParams(newParams)
    }

    return (
        <>
            <PageTitle>Search</PageTitle>
            <SearchBar handleSearch={updateSearchParams(true)} />
            <FilterGroup
                filters={filters}
                setFilters={setFilters}
                handleSearch={updateSearchParams(false)}
            />
        </>
    )
}

export default SearchPage
