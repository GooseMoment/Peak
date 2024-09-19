import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"

import PageTitle from "@components/common/PageTitle"
import FilterGroup from "@components/search/FilterGroup"
import SearchBar from "@components/search/SearchBar"

import queryClient from "@queries/queryClient"

import { getSearchResults } from "@/api/search.api"
import SearchResults from "@/components/search/SearchResults"
import { toast } from "react-toastify"

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

const getCursorFromURL = (url) => {
    if (!url) return null

    const u = new URL(url)
    const cursor = u.searchParams.get("cursor")
    return cursor
}

const SearchPage = () => {
    const [filters, setFilters] = useState(initialFilterGroup)

    const [searchParams, setSearchParams] = useSearchParams()

    const updateSearchParams = (isEditSearchQuery) => (searchQuery) => {
        const recentFilters = isEditSearchQuery ? filters : searchQuery

        const newParams = new URLSearchParams(searchParams)

        if (isEditSearchQuery) newParams.set("searchTerms", searchQuery)

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
        queryClient.removeQueries(["search"])
    }

    useEffect(() => {
        refetchResult()
    }, [searchParams])

    const {
        data: resultPage,
        fetchNextPage: fetchNextResultPage,
        refetch: refetchResult,
    } = useInfiniteQuery({
        queryKey: ["search"],
        queryFn: (page) => getSearchResults(searchParams, page.pageParam),
        initialPageParam: "",
        getNextPageParam: (lastPage) => getCursorFromURL(lastPage.next),
        enabled: !!searchParams,
    })

    return (
        <>
            <PageTitle>Search</PageTitle>
            <SearchBar handleSearch={updateSearchParams(true)} />
            <FilterGroup
                filters={filters}
                setFilters={setFilters}
                handleSearch={updateSearchParams(false)}
            />
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
