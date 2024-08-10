import { Fragment } from "react"

import { useInfiniteQuery } from "@tanstack/react-query"
import styled from "styled-components"

import { TaskList } from "@components/drawers/Drawer"
import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import TaskBox from "@components/social/logDetails/TaskBox"

import { getDailyLogTasks } from "@api/social.api"

const getPageFromURL = (url) => {
    if (!url) return null

    const u = new URL(url)
    const page = u.searchParams.get("page")
    return page
}

const DrawerBundle = ({ drawer, isFollowing, selectedDate }) => {
    const {
        data: taskPage,
        fetchNextPage: fetchNextTaskPage,
        isPending: isTaskPending,
        refetch: refetchTask,
    } = useInfiniteQuery({
        queryKey: ["daily", "log", "details", "task", drawer.id, selectedDate],
        queryFn: (pages) =>
            getDailyLogTasks(drawer.id, selectedDate, pages.pageParam || 1),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    const hasNextPage =
        taskPage?.pages[taskPage?.pages?.length - 1].next !== null

    return (
        <Fragment>
            <DrawerBox $color={drawer.color}>
                <DrawerName $color={drawer.color}> {drawer.name} </DrawerName>
            </DrawerBox>
            <TaskList>
                {taskPage?.pages?.map((group) =>
                    group?.results?.map((task) => (
                        <TaskBox
                            key={task.id}
                            task={task}
                            color={drawer.color}
                            isFollowing={isFollowing}
                        />
                    )),
                )}
            </TaskList>
        </Fragment>
    )
}

export default DrawerBundle
