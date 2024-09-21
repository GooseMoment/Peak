import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { useInfiniteQuery } from "@tanstack/react-query"

import PageTitle from "@components/common/PageTitle"
import FilterGroup from "@components/search/FilterGroup"
import SearchBar from "@components/search/SearchBar"
import SearchResults from "@components/search/SearchResults"

import queryClient from "@queries/queryClient"

import { getSearchResults } from "@/api/search.api"

const initialFilterGroup = {
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
}

const getCursorFromURL = (url) => {
    if (!url) return null

    const u = new URL(url)
    const cursor = u.searchParams.get("cursor")
    return cursor
}

const SearchPage = () => {
    const [filters, setFilters] = useState()

    // useState로 하면 아주 잘 돌아감 아니 왜?
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        searchParams?.forEach((value, key) => {
            initialFilterGroup[key].value = value === "null" ? null : value
        })
        setFilters(initialFilterGroup)
    }, [searchParams])
    // 이러면 굳이 updateFilterValue가 필요 없을 거긴 한데 나중에 기능 추가하면서 수정 고려

    const updateFilterValue = (filterName, filterValue) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: {
                ...prev[filterName],
                value: filterValue ? filterValue : null,
            },
        }))
    }

    const updateSearchParam = (filterName, filterValue) => {
        const newParams = new URLSearchParams(searchParams)

        if (filterValue && filters[filterName].type === "date") {
            newParams.set(
                filterName,
                filterValue.startDate + "to" + filterValue.endDate,
            )
        } else {
            newParams.set(filterName, filterValue)
        }

        setSearchParams(newParams)
    }

    const updateSearchQuery = (filterName) => (filterValue) => {
        updateSearchParam(filterName, filterValue)
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
        queryFn: (page) => getSearchResults(searchParams, page.pageParam),
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
