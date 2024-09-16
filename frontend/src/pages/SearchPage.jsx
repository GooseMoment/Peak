import { useState } from "react"

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
    enableMemoSearch: {
        name: "Memo",
        type: "text",
        value: null,
    },
}

const SearchPage = () => {
    const [filters, setFilters] = useState(initialFilterGroup)

    return (
        <>
            <PageTitle>Search</PageTitle>
            <SearchBar handleSearch={console.log} />
            <FilterGroup filters={filters} setFilters={setFilters} />
        </>
    )
}

export default SearchPage
