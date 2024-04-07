import { useState } from "react"

import FilterButtonGroup from "@components/notifications/FilterButtonGroup"
import Box from "@components/notifications/Box"
import PageTitle from "@components/common/PageTitle"

import { getNotifications } from "@api/notifications.api"

import { useQuery } from "@tanstack/react-query"

const NotificationsPage = () => {
    const [activeFilter, setActiveFilter] = useState("all")

    const { data, isPending, isError, error } = useQuery({ queryKey: ["notifications", {types: filters[activeFilter]}], queryFn: getNotifications })

    if (isPending) return <div>Loading</div>
    // TODO: add skeleton

    if (isError) {
        console.log("error:", error)
        return <div>Error!</div>
    } 

    return <>
    <PageTitle>Notifications</PageTitle>
    <FilterButtonGroup filters={filters} active={activeFilter} setActive={setActiveFilter} />
    {data.results.map(notification => <Box key={notification.id} notification={notification} />)}
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
