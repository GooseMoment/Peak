import { useState } from "react"

import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import styled, { css, useTheme } from "styled-components"

import Button from "@components/common/Button"
import CollapseButton from "@components/common/CollapseButton"
import PageTitle from "@components/common/PageTitle"
import { ErrorBox } from "@components/errors/ErrorProjectPage"
import { getProjectColor } from "@components/project/common/palettes"
import { SkeletonDueTasks } from "@components/project/skeletons/SkeletonTodayPage"
import Task from "@components/tasks/Task"

import { patchTask } from "@api/tasks.api"
import {
    getTasksAssignedToday,
    getTasksDueToday,
    getTasksOverdue,
} from "@api/today.api"

import { useClientTimezone } from "@utils/clientSettings"

import queryClient from "@queries/queryClient"

import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { ifMobile } from "@/utils/useScreenType"

const getPageFromURL = (url) => {
    if (!url) return null

    const u = new URL(url)
    const page = u.searchParams.get("page")
    return page
}

const TodayPage = () => {
    const { t } = useTranslation(null, { keyPrefix: "today" })
    const tz = useClientTimezone()
    const theme = useTheme()

    const [filter, setFilter] = useState("due_date")
    const [collapsed, setCollapsed] = useState(false)

    const today = DateTime.now().setZone(tz)
    const [selectedDate, setSelectedDate] = useState(today.toISODate())
    // #TODO 달력으로 날짜 선택하기

    const {
        data: overdueTasks,
        fetchNextPage: overdueFetchNextPage,
        isLoading: isOverdueLoading,
        isError: isOverdueError,
        refetch: overdueRefetch,
    } = useInfiniteQuery({
        queryKey: ["today", "overdue", { filter_field: filter }],
        queryFn: (pages) => getTasksOverdue(filter, pages.pageParam || 1),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    const overdueHasNextPage =
        overdueTasks?.pages[overdueTasks?.pages?.length - 1].next !== null

    const {
        data: todayAssignmentTasks,
        fetchNextPage: todayAssignmentFetchNextPage,
        isLoading: isTodayAssignmentLoading,
        isError: isTodayAssignmentError,
        refetch: todayAssignmentRefetch,
    } = useInfiniteQuery({
        queryKey: ["today", "assigned"],
        queryFn: (pages) =>
            getTasksAssignedToday(selectedDate, pages.pageParam || 1),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    const todayHasNextPage =
        todayAssignmentTasks?.pages[todayAssignmentTasks?.pages?.length - 1]
            .next !== null

    const onClickErrorBox = () => {
        overdueRefetch()
        todayAssignmentRefetch()
    }

    const patchMutation = useMutation({
        mutationFn: ({ task, data }) => {
            return patchTask(task.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["today", "overdue"],
            })
            queryClient.invalidateQueries({
                queryKey: ["today", "assigned"],
            })
        },
        onError: () => {
            toast.error(t("due_change_error"))
        },
    })

    const clickArrowDown = (task) => {
        const data = { assigned_at: today.toISODate() }

        patchMutation.mutate({ task, data })
        toast.success(t("due_change_today_success"))
    }

    const clickArrowRight = (task) => {
        const tomorrow = today.plus({ days: 1 })
        const data = { assigned_at: tomorrow.toISODate() }

        patchMutation.mutate({ task, data })
        toast.success(t("due_change_tomorrow_success"))
    }

    return (
        <>
            <PageTitle>{t("title")}</PageTitle>
            {(<OverdueTasksBlock>
                    <OverdueTitle>
                        <FeatherIcon icon="alert-circle" />
                        {t("overdue_title")}
                        <CollapseButtonBlock>
                            <CollapseButton
                                collapsed={collapsed}
                                handleCollapsed={() =>
                                    setCollapsed((prev) => !prev)
                                }
                            />
                        </CollapseButtonBlock>
                    </OverdueTitle>
                    {collapsed ? null : (
                        <>
                            <FilterButtonBox>
                                {filterContents.map((content) => (
                                    <FilterButton
                                        key={content}
                                        $isActive={filter === content}
                                        onClick={() => setFilter(content)}>
                                        {t("filter_" + content)}
                                    </FilterButton>
                                ))}
                            </FilterButtonBox>
                            <TasksBox>
                                {(isOverdueError || isTodayAssignmentError) && (
                                    <ErrorBox onClick={onClickErrorBox}>
                                        {t("error_load_task")}
                                    </ErrorBox>
                                )}
                                {isOverdueLoading && (
                                    <SkeletonDueTasks taskCount={4} />
                                )}
                                {overdueTasks?.pages?.map((group) =>
                                    group?.results?.map((task) => (
                                        <OverdueTaskBox key={task.id}>
                                            <Task
                                                task={task}
                                                color={getProjectColor(
                                                    theme.type,
                                                    task.project_color,
                                                )}
                                            />
                                            <Icons>
                                                <FeatherIcon
                                                    icon="arrow-down"
                                                    onClick={() =>
                                                        clickArrowDown(task)
                                                    }
                                                />
                                                <FeatherIcon
                                                    icon="arrow-right"
                                                    onClick={() =>
                                                        clickArrowRight(task)
                                                    }
                                                />
                                            </Icons>
                                        </OverdueTaskBox>
                                    )),
                                )}
                            </TasksBox>
                            {overdueHasNextPage ? (
                                <MoreText
                                    onClick={() => overdueFetchNextPage()}>
                                    {t("button_load_more") + " "}(
                                    {overdueTasks?.pages[0].count})
                                </MoreText>
                            ) : null}
                        </>
                    )}
                </OverdueTasksBlock>
            )}
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
                                color={getProjectColor(
                                    theme.type,
                                    task.project_color,
                                )}
                            />
                        )),
                    )
                )}
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

const OverdueTasksBlock = styled.div`
    border: 1.8px solid ${(p) => p.theme.project.borderColor};
    border-radius: 15px;
    margin: 1.4em 0.5em;
    padding: 1.5em 1em;
`

const OverdueTitle = styled.div`
    font-size: 1.2em;
    font-weight: bold;
    margin-left: 1em;
`

const CollapseButtonBlock = styled.div`
    float: right;
    cursor: pointer;
    margin-top: 0.1em;
    margin-right: 0.5em;
`

const OverdueTaskBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Icons = styled(FlexCenterBox)`
    gap: 0.8em;

    & svg {
        stroke: ${(p) => p.theme.textColor};
        cursor: pointer;
    }
`

const FilterButtonBox = styled.div`
    display: flex;
    gap: 0.8em;
    margin: 1em 1.2em 0em;
`

const FilterButton = styled.div`
    width: fit-content;
    padding: 0.4em 1em;
    border: 1px solid ${(p) => p.theme.borderColor};
    border-radius: 15px;
    color: ${(p) => p.theme.textColor};
    background-color: ${(p) => p.theme.backgroundColor};
    font-size: 0.9em;
    font-weight: normal;
    cursor: pointer;

    ${(props) =>
        props.$isActive &&
        css`
            color: ${(p) => p.theme.white};
            background-color: ${(p) => p.theme.goose};
        `}
`

const TasksBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0.3em 0.8em;
    overflow: hidden;
`

const MoreText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(p) => p.theme.secondTextColor};
    margin-top: 1em;
    font-size: 0.9em;
    cursor: pointer;
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

const filterContents = ["due_date", "assigned_at"]

export default TodayPage
