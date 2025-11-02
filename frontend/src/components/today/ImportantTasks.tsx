import { useEffect, useMemo, useState } from "react"

import {
    InfiniteData,
    useInfiniteQuery,
    useMutation,
} from "@tanstack/react-query"
import styled, { css } from "styled-components"

import CollapseButton from "@components/common/CollapseButton"
import { ErrorBox } from "@components/errors/ErrorProjectPage"
import { SkeletonDueTasks } from "@components/project/skeletons/SkeletonTodayPage"
import TaskBlock from "@components/tasks/TaskBlock"

import { type PaginationData } from "@api/common"
import { type Task, TaskPost, patchTask } from "@api/tasks.api"
import {
    getTasksOverDue,
    getTasksPastAssigned,
    getTasksTodayDue,
} from "@api/today.api"

import { useClientTimezone } from "@utils/clientSettings"
import { getPageFromURL } from "@utils/pagination"
import { ifMobile } from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const isTaskEmpty = (
    tasks: InfiniteData<PaginationData<Task>, unknown> | undefined,
) => !!(tasks?.pages[0]?.results.length === 0)

const useTaskQuery = (
    filter: FilterContentsKey,
    fetchFunction: (page: string) => Promise<PaginationData<Task>>,
) => {
    const {
        data: tasks,
        fetchNextPage,
        isLoading,
        isError,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["today", filter],
        queryFn: (pages) => fetchFunction(pages?.pageParam),
        initialPageParam: "1",
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    return {
        tasks,
        fetchNextPage,
        isEmpty: isTaskEmpty(tasks),
        isLoading,
        isError,
        refetch,
    }
}

type FilterContentsKey = "todayDue" | "overDue" | "pastAssigned"

const filterContents: FilterContentsKey[] = [
    "todayDue",
    "overDue",
    "pastAssigned",
]

const ImportantTasks = () => {
    const { t } = useTranslation("translation")

    const tz = useClientTimezone()

    const today = useMemo(() => DateTime.now().setZone(tz), [tz])

    const [filter, setFilter] = useState<FilterContentsKey>("todayDue")
    const [collapsed, setCollapsed] = useState<boolean>(false)

    const todayDueQuery = useTaskQuery("todayDue", getTasksTodayDue)
    const overDueQuery = useTaskQuery("overDue", getTasksOverDue)
    const pastAssignedQuery = useTaskQuery("pastAssigned", getTasksPastAssigned)

    const queries = useMemo(
        () => ({
            todayDue: todayDueQuery,
            overDue: overDueQuery,
            pastAssigned: pastAssignedQuery,
        }),
        [todayDueQuery, overDueQuery, pastAssignedQuery],
    )

    const selectedQuery = queries[filter]

    const hasNextPage =
        selectedQuery.tasks?.pages[selectedQuery.tasks?.pages?.length - 1]
            .next !== null

    useEffect(() => {
        for (const name of filterContents) {
            if (!queries[name].isEmpty) {
                setFilter(name)
                break
            }
        }
        // queries 객체 자체를 의존성에 포함하면 무한 루프가 발생하므로 .tasks 속성만 포함
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [todayDueQuery.tasks, overDueQuery.tasks, pastAssignedQuery.tasks])

    const patchMutation = useMutation({
        mutationFn: ({
            task,
            data,
        }: {
            task: Task
            data: Partial<TaskPost>
        }) => {
            return patchTask(task.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["today", filter],
            })
            queryClient.invalidateQueries({
                queryKey: ["today", "assigned"],
            })
        },
        onError: () => {
            toast.error(t("today.due_change_error"))
        },
    })

    const clickArrowDown = (task: Task) => {
        const data = { assigned_at: today.toISODate() }

        patchMutation.mutate({ task, data })
        toast.success(t("today.due_change_today_success"))
    }

    const clickArrowRight = (task: Task) => {
        const tomorrow = today.plus({ days: 1 })
        const data = { assigned_at: tomorrow.toISODate() }

        patchMutation.mutate({ task, data })
        toast.success(t("today.due_change_tomorrow_success"))
    }

    return todayDueQuery.isEmpty &&
        overDueQuery.isEmpty &&
        pastAssignedQuery.isEmpty ? null : (
        <ImportantTasksBlock>
            <ImportantTasksTitle>
                <FeatherIcon icon="alert-circle" />
                {t("today.important_title")}
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
                                {t(`today.filter_${content}`)}
                            </FilterButton>
                        ))}
                    </FilterButtonBox>
                    <TasksBox>
                        {selectedQuery.isError && (
                            <ErrorBox onClick={() => selectedQuery.refetch()}>
                                {t("today.error_load_task")}
                            </ErrorBox>
                        )}
                        {selectedQuery.isLoading && (
                            <SkeletonDueTasks taskCount={4} />
                        )}
                        {selectedQuery.tasks?.pages?.map((group) =>
                            group.results.length === 0 ? (
                                <NoTasksMessage key={group.results.length}>
                                    {t(`today.no_tasks_${filter}`)}
                                </NoTasksMessage>
                            ) : (
                                group?.results?.map((task) => (
                                    <ImportantTaskBox key={task.id}>
                                        <TaskBlock task={task} />
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
                    {hasNextPage ? (
                        <MoreText onClick={() => selectedQuery.fetchNextPage()}>
                            {t("common.load_more") + " "}(
                            {selectedQuery.tasks?.pages[0]?.results.length})
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

const FilterButton = styled.div<{ $isActive: boolean }>`
    width: fit-content;
    text-align: center;
    padding: 0.4em 0.6em;
    border: 1px solid ${(p) => p.theme.project.borderColor};
    border-radius: 13px;
    color: ${(p) => p.theme.textColor};
    background-color: ${(p) => p.theme.backgroundColor};
    font-size: 0.9em;
    font-weight: 500;
    cursor: pointer;
    word-break: keep-all;

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
            color: ${(p) => p.theme.backgroundColor};
            border: 1.5px solid ${(p) => p.theme.textColor};
            background-color: ${(p) => p.theme.textColor};
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
