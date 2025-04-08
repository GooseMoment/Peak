import { useMemo, useState } from "react"

import { useMutation } from "@tanstack/react-query"
import { useInfiniteQuery } from "@tanstack/react-query"
import styled, { css, useTheme } from "styled-components"

import CollapseButton from "@components/common/CollapseButton"
import { ErrorBox } from "@components/errors/ErrorProjectPage"
import { SkeletonDueTasks } from "@components/project/skeletons/SkeletonTodayPage"
import Task from "@components/tasks/Task"

import { patchTask } from "@api/tasks.api"
import {
    getTasksOverDue,
    getTasksPastAssigned,
    getTasksTodayDue,
} from "@api/today.api"

import { useClientTimezone } from "@utils/clientSettings"
import { getPageFromURL } from "@utils/pagination"
import { ifMobile } from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { getPaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const useTaskQuery = (filter, fetchFunction) => {
    const {
        data: tasks,
        fetchNextPage,
        isLoading,
        isError,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["today", filter],
        queryFn: (pages) => fetchFunction(pages.pageParam || 1),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    return { tasks, fetchNextPage, isLoading, isError, refetch }
}

const filterContents = ["todayDue", "overDue", "pastAssigned"]

const ImportantTasks = () => {
    const { t } = useTranslation(null, { keyPrefix: "today" })
    const tz = useClientTimezone()
    const theme = useTheme()

    const today = DateTime.now().setZone(tz)

    const [filter, setFilter] = useState("todayDue")
    const [collapsed, setCollapsed] = useState(false)

    const fetchFunctionMap = {
        todayDue: getTasksTodayDue,
        overDue: getTasksOverDue,
        pastAssigned: getTasksPastAssigned,
    }

    const { tasks, fetchNextPage, isLoading, isError, refetch } = useTaskQuery(
        filter,
        fetchFunctionMap[filter],
    )

    const importantHasNextPage =
        tasks?.pages[tasks?.pages?.length - 1].next !== null

    const patchMutation = useMutation({
        mutationFn: ({ task, data }) => {
            return patchTask(task.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["today", filter],
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

    const todayDueQuery = useTaskQuery("todayDue", getTasksTodayDue)
    const overDueQuery = useTaskQuery("overDue", getTasksOverDue)
    const pastAssignedQuery = useTaskQuery("pastAssigned", getTasksPastAssigned)

    // 모든 tasks가 비어 있는지 검사
    const allTasksEmpty = useMemo(() => {
        const todayDueTasks =
            todayDueQuery.tasks?.pages.flatMap((page) => page.results) || []
        const overDueTasks =
            overDueQuery.tasks?.pages.flatMap((page) => page.results) || []
        const pastAssignedTasks =
            pastAssignedQuery.tasks?.pages.flatMap((page) => page.results) || []

        const allEmpty =
            todayDueTasks.length === 0 &&
            overDueTasks.length === 0 &&
            pastAssignedTasks.length === 0

        if (allEmpty) return true

        if (todayDueTasks.length > 0) {
            setFilter("todayDue")
        } else if (overDueTasks.length > 0) {
            setFilter("overDue")
        } else if (pastAssignedTasks.length > 0) {
            setFilter("pastAssigned")
        }
        return false
    }, [todayDueQuery.tasks, overDueQuery.tasks, pastAssignedQuery.tasks])

    if (allTasksEmpty) {
        return null
    }

    return (
        <ImportantTasksBlock>
            <ImportantTasksTitle>
                <FeatherIcon icon="alert-circle" />
                {t("important_title")}
                <CollapseButtonBlock>
                    <CollapseButton
                        collapsed={collapsed}
                        handleCollapsed={() => setCollapsed((prev) => !prev)}
                    />
                </CollapseButtonBlock>
            </ImportantTasksTitle>

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
                        {isError && (
                            <ErrorBox onClick={() => refetch()}>
                                {t("error_load_task")}
                            </ErrorBox>
                        )}
                        {isLoading && <SkeletonDueTasks taskCount={4} />}
                        {tasks?.pages?.map((group) =>
                            group.count === 0 ? (
                                <NoTasksMessage key={group.count}>
                                    {t("no_tasks_" + filter)}
                                </NoTasksMessage>
                            ) : (
                                group?.results?.map((task) => (
                                    <ImportantTaskBox key={task.id}>
                                        <Task
                                            task={task}
                                            color={getPaletteColor(
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
                                    </ImportantTaskBox>
                                ))
                            ),
                        )}
                    </TasksBox>
                    {importantHasNextPage ? (
                        <MoreText onClick={() => fetchNextPage()}>
                            {t("button_load_more") + " "}(
                            {tasks?.pages[0].count})
                        </MoreText>
                    ) : null}
                </>
            )}
        </ImportantTasksBlock>
    )
}

const ImportantTasksBlock = styled.div`
    border: 1.8px solid ${(p) => p.theme.project.borderColor};
    border-radius: 15px;
    margin: 1.4em 0.5em;
    padding: 1em 0.8em;

    ${ifMobile} {
        margin: 0;
        padding: 1em;
    }
`

const ImportantTasksTitle = styled.div`
    font-size: 1.2em;
    font-weight: bold;
    margin-left: 0.5em;
`

const CollapseButtonBlock = styled.div`
    float: right;
    cursor: pointer;
    margin-top: 0.1em;
    margin-right: 0.4em;
`

const ImportantTaskBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${ifMobile} {
        flex-direction: column;
        align-items: flex-start;
    }
`

const Icons = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.8em;

    & svg {
        stroke: ${(p) => p.theme.textColor};
        cursor: pointer;
    }

    ${ifMobile} {
        margin: 0em 1.2em 1em;
    }
`

const FilterButtonBox = styled.div`
    display: flex;
    gap: 0.5em;
    margin: 1em 0.6em 0em;
`

const FilterButton = styled.div`
    width: fit-content;
    padding: 0.35em 0.7em;
    border: 1px solid ${(p) => p.theme.project.borderColor};
    border-radius: 13px;
    color: ${(p) => p.theme.textColor};
    background-color: ${(p) => p.theme.backgroundColor};
    font-size: 0.9em;
    font-weight: 500;
    cursor: pointer;

    ${(props) =>
        !props.$isActive &&
        css`
            &:hover {
                background-color: ${(p) => p.theme.secondBackgroundColor};
            }
    `}

    ${(props) =>
        props.$isActive &&
        css`
            color: ${(p) => p.theme.white};
            border: 1.5px solid ${(p) => p.theme.goose};
            background-color: ${(p) => p.theme.goose};
        `}
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

const TasksBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin: 0.5em 0.6em 0em;
    overflow: hidden;
`

const NoTasksMessage = styled.div`
    text-align: center;
    color: ${(p) => p.theme.secondTextColor};
    font-size: 1em;
    margin: 1em 1em;
`

export default ImportantTasks
