import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"

import FilterButtonGroup from "@components/notifications/FilterButtonGroup"
import Box from "@components/notifications/Box"
import PageTitle from "@components/common/PageTitle"

import { getNotifications } from "@api/notifications.api"

import { useInfiniteQuery } from "@tanstack/react-query"
import { ImpressionArea } from "@toss/impression-area"
import styled from "styled-components"
import { toast } from "react-toastify"
import { DateTime } from "luxon"

const getCursorFromURL = (url) => {
    if (!url) return null
    
    const u = new URL(url)
    const cursor = u.searchParams.get("cursor")
    return cursor
}

const NotificationsPage = () => {
    const [activeFilter, setActiveFilter] = useState("all")
    const [searchParams, ] = useSearchParams()

    const id = searchParams.get("id")

    const scrollToBox = useCallback(node => {
        node?.scrollIntoView({block: "center", scrollBehavior: "smooth"})
    })

    const { data, isError, error, fetchNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["notifications", {types: filters[activeFilter]}],
        queryFn: getNotifications,
        initialPageParam: "",
        getNextPageParam: (lastPage, pages) => getCursorFromURL(lastPage.next),
    })

    // useInfiniteQuery에서 제공하는 hasNextPage가 제대로 작동 안함. 어째서?
    const hasNextPage = data?.pages[data?.pages?.length-1].next !== null

    const lastDate = useRef(null)
    useEffect(() => {
        lastDate.current = null
    }, [activeFilter])

    const header = <>
        <PageTitle>Notifications</PageTitle>
        <FilterButtonGroup filters={filters} active={activeFilter} setActive={setActiveFilter} />
        <Blank />
    </>

    if (isError) {
        toast.error("Failed to load notifications.")
        return <>
        {header}
        {[...Array(10)].map((e, i) => <Box key={i} skeleton />)}
        </>
    } 

    return <>
    {header}
    {
        isFetching && !isFetchingNextPage ? [...Array(10)].map((e, i) => <Box key={i} skeleton />) : null
    }
    {data?.pages.map((group, i) => (
        <Fragment key={i}>
            {group.results.map((notification, j) => {
                let dateDelimiter = null;
                const thisDate = DateTime.fromISO(notification.created_at).toRelativeCalendar({unit: "days"})

                if (i === 0 && j === 0 || thisDate !== lastDate.current) {
                    dateDelimiter = <Date>{thisDate}</Date>
                    lastDate.current = thisDate
                }

                return <Fragment key={notification.id}>
                    {dateDelimiter}
                    <Box 
                        notification={notification} 
                        highlight={notification.id === id} 
                        ref={notification.id === id ? scrollToBox : null} 
                    />
                </Fragment>
            })}
        </Fragment>
    ))}
    <ImpressionArea onImpressionStart={() => fetchNextPage()} timeThreshold={200}>
        {hasNextPage ? <Box skeleton /> : <NoMore>No more notifications!</NoMore>}
    </ImpressionArea>
    </>
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

const filters = {
    "all": {
        display: "All", types: ["task_reminder", "reaction", "follow", "follow_request", "follow_request_accepted", "comment", "peck"]
    },
    "tasks": {
        display: "Tasks", types: ["task_reminder"]
    },
    "comments": {
        display: "Comments", types: ["comment"]
    },
    "reactions": {
        display: "Reactions", types: ["reaction"]
    },
    "pecking": {
        display: "Pecking", types: ["peck"]
    },
    "follow": {
        display: "Follow", types: ["follow", "follow_request", "follow_request_accepted"]
    },
}

export default NotificationsPage
