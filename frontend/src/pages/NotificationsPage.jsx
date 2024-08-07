import {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { useSearchParams } from "react-router-dom"

import { useInfiniteQuery } from "@tanstack/react-query"
import styled from "styled-components"

import FilterButtonGroup from "@components/common/FilterButtonGroup"
import PageTitle from "@components/common/PageTitle"
import Box from "@components/notifications/Box"

import { getNotifications } from "@api/notifications.api"

import { useClientLocale } from "@utils/clientSettings"

import { ImpressionArea } from "@toss/impression-area"
import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const getCursorFromURL = (url) => {
    if (!url) return null

    const u = new URL(url)
    const cursor = u.searchParams.get("cursor")
    return cursor
}

const defaultFilter = "all"

const NotificationsPage = () => {
    const locale = useClientLocale()
    const { t } = useTranslation("", { keyPrefix: "notifications" })

    const filters = useMemo(() => makeFilters(t), [t])

    const [searchParams, setSearchParams] = useSearchParams()
    const focusID = searchParams.get("id")
    const paramActiveFilter = searchParams.get("active")

    const [activeFilter, setActiveFilter] = useState(
        Object.keys(filters).includes(paramActiveFilter)
            ? paramActiveFilter
            : defaultFilter,
    )

    const scrollToBox = useCallback((node) => {
        node?.scrollIntoView({ block: "center", scrollBehavior: "smooth" })
    })

    const { data, isError, fetchNextPage, isFetching, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["notifications", { types: filters[activeFilter] }],
            queryFn: getNotifications,
            initialPageParam: "",
            getNextPageParam: (lastPage) => getCursorFromURL(lastPage.next),
        })

    // useInfiniteQuery에서 제공하는 hasNextPage가 제대로 작동 안함. 어째서?
    const hasNextPage = data?.pages[data?.pages?.length - 1].next !== null
    const isNotificationEmpty = data?.pages[0]?.results?.length === 0

    const lastDate = useRef(null)
    useEffect(() => {
        lastDate.current = null
        setSearchParams({ active: activeFilter })
    }, [activeFilter])

    const header = (
        <>
            <PageTitle>{t("title")}</PageTitle>
            <FilterButtonGroup
                filters={filters}
                active={activeFilter}
                setActive={setActiveFilter}
            />
            <Blank />
        </>
    )

    if (isError) {
        toast.error(t("fail_to_load"))
        return (
            <>
                {header}
                {[...Array(10)].map((e, i) => (
                    <Box key={i} skeleton />
                ))}
            </>
        )
    }

    return (
        <>
            {header}
            {isFetching && !isFetchingNextPage
                ? [...Array(10)].map((e, i) => <Box key={i} skeleton />)
                : null}
            {data?.pages.map((group, i) => (
                <Fragment key={i}>
                    {group.results.map((notification, j) => {
                        let dateDelimiter = null
                        const thisDate = DateTime.fromISO(
                            notification.created_at,
                        )
                            .setLocale(locale)
                            .toRelativeCalendar({ unit: "days" })

                        if (
                            (i === 0 && j === 0) ||
                            thisDate !== lastDate.current
                        ) {
                            dateDelimiter = <Date>{thisDate}</Date>
                            lastDate.current = thisDate
                        }

                        return (
                            <Fragment key={notification.id}>
                                {dateDelimiter}
                                <Box
                                    notification={notification}
                                    highlight={notification.id === focusID}
                                    ref={
                                        notification.id === focusID
                                            ? scrollToBox
                                            : null
                                    }
                                />
                            </Fragment>
                        )
                    })}
                </Fragment>
            ))}
            <ImpressionArea
                onImpressionStart={() => fetchNextPage()}
                timeThreshold={200}
            >
                {hasNextPage && <Box skeleton />}
                {!hasNextPage && !isNotificationEmpty && (
                    <NoMore>{t("no_more")}</NoMore>
                )}
            </ImpressionArea>
            {isNotificationEmpty && <NoMore>{t("empty")}</NoMore>}
        </>
    )
}

const Blank = styled.div`
    height: 3em;
`

const NoMore = styled.div`
    box-sizing: border-box;

    height: 7em;
    padding: 1em;
    margin: 1em;
    margin-bottom: 3em;

    display: flex;
    align-items: center;
    justify-content: center;
`

const Date = styled.h2`
    font-weight: bold;
`

const makeFilters = (t) => ({
    all: {
        display: t("type_all"),
        types: [
            "task_reminder",
            "reaction",
            "follow",
            "follow_request",
            "follow_request_accepted",
            "comment",
            "peck",
        ],
    },
    tasks: {
        display: t("type_tasks"),
        types: ["task_reminder"],
    },
    comments: {
        display: t("type_comments"),
        types: ["comment"],
    },
    reactions: {
        display: t("type_reactions"),
        types: ["reaction"],
    },
    pecking: {
        display: t("type_pecking"),
        types: ["peck"],
    },
    follow: {
        display: t("type_follow"),
        types: ["follow", "follow_request", "follow_request_accepted"],
    },
})

export default NotificationsPage
