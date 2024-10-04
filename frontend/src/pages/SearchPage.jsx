import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { useInfiniteQuery } from "@tanstack/react-query"

import PageTitle from "@components/common/PageTitle"
import FilterGroup from "@components/search/FilterGroup"
import SearchBar from "@components/search/SearchBar"
import SearchResults from "@components/search/SearchResults"

import { getSearchResults } from "@api/search.api"

import queryClient from "@queries/queryClient"

const initialFilterGroup = (t) => ({
    searchTerms: {
        name: "Terms",
        type: "text",
        value: null,
    },
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
})

const getCursorFromURL = (url) => {
    if (!url) return null

    const u = new URL(url)
    const cursor = u.searchParams.get("cursor")
    return cursor
}

const SearchPage = () => {
    const [filters, setFilters] = useState(initialFilterGroup)

    const updateFilterValue = (filterName, filterValue) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: {
                ...prev[filterName],
                value: filterValue ? filterValue : null,
            },
        }))
    }

    const updateSearchQuery = (filterName) => (filterValue) => {
        updateFilterValue(filterName, filterValue)

        queryClient.invalidateQueries(["search"])

        setTimeout(() => {
            refetchResult()
        }, 0)
    }

    const {
        data: resultPage,
        fetchNextPage: fetchNextResultPage,
        refetch: refetchResult,
    } = useInfiniteQuery({
        queryKey: ["search"],
        queryFn: (page) => getSearchResults(filters, page.pageParam),
        initialPageParam: "",
        getNextPageParam: (lastPage) => getCursorFromURL(lastPage.next),
        enabled: false,
    })

    return (
        <>
            <PageTitle>Search</PageTitle>
            <SearchBar handleSearch={updateSearchQuery("searchTerms")} />
            <FilterGroup filters={filters} handleSearch={updateSearchQuery} />
            {resultPage && (
                <SearchResults
                    resultPage={resultPage}
                    fetchNextResultPage={fetchNextResultPage}
                />
            )}
        </>
    )
}

export default SearchPage
