import { useState } from "react"
import { useInfiniteQuery, useMutation } from "@tanstack/react-query"

import styled, { css, useTheme } from "styled-components"

import PageTitle from "@components/common/PageTitle"
import Task from "@components/tasks/Task"
import Button from "@components/common/Button"
import { ErrorBox } from "@components/errors/ErrorProjectPage"
import { SkeletonDueTasks } from "@components/project/skeletons/SkeletonTodayPage"
import { getProjectColor } from "@components/project/Creates/palettes"
import { useClientTimezone } from "@utils/clientSettings"
import { getOverdueTasks, getTodayTasks, patchTask } from "@api/tasks.api"

import queryClient from "@queries/queryClient"
import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const getPageFromURL = (url) => {
    if (!url) return null

    const u = new URL(url)
    const page = u.searchParams.get("page")
    return page
}

const TodayPage = () => {
    const { t } = useTranslation(null, { keyPrefix: "today" })
    const due_tz = useClientTimezone()
    const theme = useTheme()
    
    const [filter, setFilter] = useState("due_date")

    const { 
        data: overdueTasks, 
        fetchNextPage: overdueFetchNextPage, 
        isLoading: isOverdueLoading, 
        isError: isOverdueError, 
        refetch: overdueRefetch
    } = useInfiniteQuery({
        queryKey: ["tasks", "overdue", { filter_field: filter }],
        queryFn: (pages) => getOverdueTasks(filter, pages.pageParam || 1),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    const overdueHasNextPage = overdueTasks?.pages[overdueTasks?.pages?.length - 1].next !== null

    const { 
        data: todayTasks, 
        fetchNextPage: todayFetchNextPage,
        isLoading: isTodayLoading, 
        isError: isTodayError, 
        refetch: todayRefetch
    } = useInfiniteQuery({
        queryKey: ["tasks", "today"],
        queryFn: (pages) => getTodayTasks(pages.pageParam || 1),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    const todayHasNextPage = todayTasks?.pages[todayTasks?.pages?.length - 1].next !== null

    const onClickErrorBox = () => {
        overdueRefetch()
        todayRefetch()
    }

    const patchMutation = useMutation({
        mutationFn: ({ task, data }) => {
            return patchTask(task.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tasks", "overdue"],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", "today"],
            })
        },
        onError: () => {
            toast.error(t("due_change_error"))
        }
    })

    const clickArrowDown = (task) => {
        const today = new Date()
        const date = today.toISOString().slice(0, 10)
        
        let data = null
        if (filter === "due_date")
            data = { due_tz: due_tz, due_date: date }
        if (filter === "assigned_at")
            data = { due_tz: due_tz, assigned_at: date }

        patchMutation.mutate({ task, data })
        toast.success(t("due_change_today_success", {filter: t("filter_" + filter)}))
    }

    const clickArrowRight = (task) => {
        let date = new Date()
        date.setDate(date.getDate() + 1)
        date = date.toISOString().slice(0, 10)

        let data = null
        if (filter === "due_date")
            data = { due_tz: due_tz, due_date: date }
        if (filter === "assigned_at")
            data = { due_tz: due_tz, assigned_at: date }

        patchMutation.mutate({ task, data })
        toast.success(t("due_change_tomorrow_success", {filter: t("filter_" + filter)}))
    }

    return (
        <>
            <PageTitle>{t("title")}</PageTitle>
            <OverdueTasksBlock>
                <OverdueTitle>
                    <FeatherIcon icon="alert-circle"/>
                    {t("overdue_title")}
                </OverdueTitle>
                <FilterButtonBox>
                    {filterContents.map(content=>(
                        <FilterButton 
                            key={content}
                            $isActive={filter === content}
                            onClick={()=>setFilter(content)}>
                            {t("filter_" + content)}
                        </FilterButton>
                    ))}
                </FilterButtonBox>
                <TasksBox>
                    {(isOverdueError || isTodayError) &&
                        <ErrorBox onClick={onClickErrorBox}>
                            {t("error_load_task")}
                        </ErrorBox>}
                    {isOverdueLoading && <SkeletonDueTasks taskCount={4} />}
                    {overdueTasks?.pages?.map((group) =>
                        group?.results?.map((task) => (
                            <OverdueTaskBox key={task.id}>
                                <Task task={task} color={getProjectColor(theme.type, task.project_color)} max_width={23} />
                                <Icons>
                                    <FeatherIcon icon="arrow-down" onClick={()=>clickArrowDown(task)}/>
                                    <FeatherIcon icon="arrow-right" onClick={()=>clickArrowRight(task)}/>
                                </Icons>
                            </OverdueTaskBox>
                        )),
                    )}
                </TasksBox>
                {overdueHasNextPage ? (
                    <MoreText onClick={() => overdueFetchNextPage()}>
                        {t("button_load_more") + " "}
                        ({overdueTasks?.pages[0].count})
                    </MoreText>
                ) : null}
            </OverdueTasksBlock>
            <TasksBox>
                {isTodayLoading && <SkeletonDueTasks taskCount={10} />}
                {todayTasks?.pages?.map((group) =>
                    group?.results?.map((task) => (
                        <Task key={task.id} task={task} color={getProjectColor(theme.type, task.project_color)} />
                    )),
                )}
            </TasksBox>
            <FlexCenterBox>
                {todayHasNextPage ? (
                    <MoreButton onClick={() => todayFetchNextPage()}>
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
    border: 1.8px solid ${p=>p.theme.project.borderColor};
    border-radius: 15px;
    margin: 2em 1em;
    padding: 1.5em;
`

const OverdueTitle = styled.div`
    font-size: 1.2em;
    font-weight: bold;
`

const OverdueTaskBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 1.5em;
`

const Icons = styled(FlexCenterBox)`
    gap: 0.8em;

    & svg {
        stroke: ${p=>p.theme.textColor};
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
    border: 1px solid ${p=>p.theme.borderColor};
    border-radius: 15px;
    color: ${p=>p.theme.textColor};
    background-color: ${p=>p.theme.backgroundColor};
    font-size: 0.9em;
    font-weight: normal;
    cursor: pointer;

    ${props=>props.$isActive && css`
        color: ${p=>p.theme.white};
        background-color: ${p=>p.theme.goose};
    `}
`

const TasksBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-left: 1.2em;
    overflow: hidden;
`

const MoreText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${p=>p.theme.grey};
    margin-top: 1em;
    font-size: 0.9em;
    cursor: pointer;
`

const MoreButton = styled(Button)`
    width: 25em;
    margin-top: 1.3em;
`

const filterContents = [
    "due_date",
    "assigned_at",
]

export default TodayPage
