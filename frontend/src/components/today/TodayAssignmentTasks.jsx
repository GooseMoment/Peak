import { useState } from "react"

import { useQuery } from "@tanstack/react-query"
import { useInfiniteQuery } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import Button from "@components/common/Button"
import TaskCreateButton from "@components/drawers/TaskCreateButton"
import { ErrorBox } from "@components/errors/ErrorProjectPage"
import TaskCreateSimple from "@components/project/TaskCreateSimple"
import { SkeletonDueTasks } from "@components/project/skeletons/SkeletonTodayPage"
import Task from "@components/tasks/Task"

import { getProject } from "@api/projects.api"
import { getTasksAssignedToday } from "@api/today.api"

import { getPageFromURL } from "@utils/pagination"

import { getPaletteColor } from "@assets/palettes"

import { useTranslation } from "react-i18next"

const TodayAssignmentTasks = ({ selectedDate }) => {
    const { t } = useTranslation(null, { keyPrefix: "today" })

    const theme = useTheme()
    const [isSimpleOpen, setIsSimpleOpen] = useState(false)

    const {
        data: todayAssignmentTasks,
        fetchNextPage: todayAssignmentFetchNextPage,
        isLoading: isTodayAssignmentLoading,
        isError: isTodayAssignmentError,
        refetch: todayAssignmentRefetch,
    } = useInfiniteQuery({
        queryKey: ["today", "assigned", selectedDate],
        queryFn: (pages) =>
            getTasksAssignedToday(selectedDate, pages.pageParam || 1),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    const inboxQuery = useQuery({
        queryKey: ["projects", "inbox"],
        async queryFn() {
            return getProject("inbox")
        },
        refetchOnWindowFocus: false,
    })

    const handleToggleSimpleCreate = () => {
        setIsSimpleOpen((prev) => !prev)
    }

    const todayHasNextPage =
        todayAssignmentTasks?.pages[todayAssignmentTasks?.pages?.length - 1]
            .next !== null

    if (isTodayAssignmentError) {
        return (
            <ErrorBox onClick={() => todayAssignmentRefetch()}>
                {t("error_load_task")}
            </ErrorBox>
        )
    }

    return (
        <>
            <TasksBox>
                {isTodayAssignmentLoading && (
                    <SkeletonDueTasks taskCount={10} />
                )}
                {todayAssignmentTasks?.pages[0].count === 0 ? (
                    <NoTaskText>{t("no_today_assignment")}</NoTaskText>
                ) : (
                    todayAssignmentTasks?.pages?.map((group) =>
                        group?.results?.map((task) => (
                            <Task
                                key={task.id}
                                task={task}
                                color={getPaletteColor(
                                    theme.type,
                                    task.project_color,
                                )}
                            />
                        )),
                    )
                )}
                {inboxQuery.data && isSimpleOpen && (
                    <TaskCreateSimple
                        projectID={inboxQuery.data.id}
                        projectName={inboxQuery.data.name}
                        drawerID={inboxQuery.data.drawers[0].id}
                        drawerName={inboxQuery.data.drawers[0].name}
                        color={inboxQuery.data.color}
                        onClose={() => setIsSimpleOpen(false)}
                        init_assigned_at={selectedDate}
                    />
                )}
                <TaskCreateButton
                    isOpen={isSimpleOpen}
                    onClick={handleToggleSimpleCreate}
                />
            </TasksBox>
            <FlexCenterBox>
                {todayHasNextPage ? (
                    <MoreButton onClick={() => todayAssignmentFetchNextPage()}>
                        {t("button_load_more")}
                    </MoreButton>
                ) : null}
            </FlexCenterBox>
        </>
    )
}

const FlexCenterBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const TasksBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0.3em 0.8em;
    overflow: hidden;
`

const MoreButton = styled(Button)`
    width: 25em;
    margin-top: 1.3em;
`

const NoTaskText = styled.div`
    text-align: center;
    margin: 1em 0em;
    font-size: 1em;
    color: ${(p) => p.theme.secondTextColor};
`

export default TodayAssignmentTasks
