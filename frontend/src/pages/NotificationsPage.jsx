import { Fragment, useState } from "react"

import FilterButtonGroup from "@components/notifications/FilterButtonGroup"
import Box from "@components/notifications/Box"
import PageTitle from "@components/common/PageTitle"

import { getNotifications } from "@api/notifications.api"

import { useInfiniteQuery } from "@tanstack/react-query"
import { ImpressionArea } from "@toss/impression-area"

const getCursorFromURL = (url) => {
    if (!url) return null
    
    const u = new URL(url)
    const cursor = u.searchParams.get("cursor")
    return cursor
}

const NotificationsPage = () => {
    const [activeFilter, setActiveFilter] = useState("all")

    const { data, isError, error, fetchNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["notifications", {types: filters[activeFilter]}],
        queryFn: getNotifications,
        initialPageParam: "",
        getNextPageParam: (lastPage, pages) => getCursorFromURL(lastPage.next),
    })

    // useInfiniteQuery에서 제공하는 hasNextPage가 제대로 작동 안함. 어째서?
    const hasNextPage = data?.pages[data?.pages?.length-1].next !== null

    const header = <>
        <PageTitle>Notifications</PageTitle>
        <FilterButtonGroup filters={filters} active={activeFilter} setActive={setActiveFilter} />
    </>

    if (isError) {
        console.log("error:", error)
        return <div>Error!</div>
    } 

    return <>
    {header}
    {
        isFetching && !isFetchingNextPage ? <div>TODO: add skeleton</div> : null
    }
    {data?.pages.map((group, i) => (
        <Fragment key={i}>
            {group.results.map(notification => <Box key={notification.id} notification={notification} />)}
        </Fragment>
    ))}
    <ImpressionArea onImpressionStart={() => fetchNextPage()} timeThreshold={200}>
        {hasNextPage ? "Loading more..." : "No more notifications!"}
    </ImpressionArea>
    </>
}

const filters = {
    "all": {
        display: "All", types: ["task_reminder", "reaction", "follow", "follow_request", "follow_request_accepted", "peck", "trending_up", "trending_down"]
    },
    "tasks": {
        display: "Tasks", types: ["task_reminder"]
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
