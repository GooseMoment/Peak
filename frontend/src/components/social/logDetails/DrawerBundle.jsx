import { Fragment } from "react"

import { useInfiniteQuery } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import { getProjectColor } from "@components/project/Creates/palettes"
import TaskBox from "@components/social/logDetails/TaskBox"

import { getDailyLogTasks } from "@api/social.api"

import FeatherIcon from "feather-icons-react"

const getPageFromURL = (url) => {
    if (!url) return null

    const u = new URL(url)
    const page = u.searchParams.get("page")
    return page
}

const DrawerBundle = ({ drawer, pageType, selectedDate }) => {
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

    const theme = useTheme()

    const hasNextPage =
        taskPage?.pages[taskPage?.pages?.length - 1].next !== null

    const color = getProjectColor(theme.type, drawer.color)

    return (
        <Fragment>
            <DrawerBox $color={color}>
                <DrawerName $color={color}>
                    {" "}
                    {drawer.name}{" "}
                </DrawerName>
            </DrawerBox>
            <TaskList>
                {taskPage?.pages?.map((group) =>
                    group?.results?.map((task) => (
                        <TaskBox
                            key={task.id}
                            task={task}
                            color={color}
                            isFollowingPage={pageType === "following"}
                        />
                    )),
                )}
                {hasNextPage && (
                    <More onClick={() => fetchNextTaskPage()}>
                        <FeatherIcon icon="chevron-down" />
                    </More>
                )}
            </TaskList>
        </Fragment>
    )
}

export const TaskList = styled.div`
    margin-left: 0.5em;
`

const More = styled.div`
    height: 2em;
    padding: 0.2em;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export default DrawerBundle
