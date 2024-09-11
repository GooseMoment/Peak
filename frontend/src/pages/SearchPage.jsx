import { useState } from "react"

import PageTitle from "@components/common/PageTitle"
import FilterGroup from "@components/search/FilterGroup"
import SearchBar from "@components/search/SearchBar"

const initialFilterGroup = {
    project: {
        name: "Project",
        value: null,
    },
    drawer: {
        name: "Drawer",
        value: null,
    },
    assignedAt: {
        name: "Assign",
        value: null,
    },
    completedAt: {
        name: "Completed",
        value: null,

    },
    privacy: {
        name: "Privacy",
        value: null,
    },
    enableMemoSearch: {
        name: "Memo",
        value: null,
    },
}

const SearchPage = () => {
    const [filterGroup, setFilterGroup] = useState(initialFilterGroup)

    return (
        <>
            <PageTitle>Search</PageTitle>
            <SearchBar handleSearch={console.log} />
            <FilterGroup filters={filterGroup} />
        </>
    )
}

export default SearchPage
