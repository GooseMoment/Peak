import { useState } from "react"

import { useInfiniteQuery } from "@tanstack/react-query"

import PageTitle from "@components/common/PageTitle"
import FilterGroup from "@components/search/FilterGroup"
import SearchBar from "@components/search/SearchBar"
import SearchResults from "@components/search/SearchResults"

import { getSearchResults } from "@api/search.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"

const initialFilterGroup = (t) => ({
    searchTerms: {
        name: t("search_terms"),
        type: "text",
        value: null,
    },
    project: {
        name: t("project"),
        type: "text",
        value: null,
    },
    drawer: {
        name: t("drawer"),
        type: "text",
        value: null,
    },
    assignedAt: {
        name: t("assigned_at"),
        type: "date",
        value: null,
    },
    completedAt: {
        name: t("completed_at"),
        type: "date",
        value: null,
    },
    // privacy: {
    //     name: t("privacy"),
    //     type: "text",
    //     value: null,
    // },
    memo: {
        name: t("memo"),
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
    const { t } = useTranslation("", { keyPrefix: "search" })

    const [filters, setFilters] = useState(
        initialFilterGroup((key) => t(`filter_button.${key}`)),
    )

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
            <PageTitle>{t("title")}</PageTitle>
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
