import { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"

import styled, { css } from "styled-components"

import PageTitle from "@components/common/PageTitle"
import Task from "@components/tasks/Task"
import Button from "@components/common/Button"
import { ErrorBox } from "@components/errors/ErrorProjectPage"
import { SkeletonDueTasks } from "@components/project/skeletons/SkeletonTodayPage"
import { getOverdueTasks, getTodayTasks } from "@api/tasks.api"

import FeatherIcon from "feather-icons-react"

const getPageFromURL = (url) => {
    if (!url) return null

    const u = new URL(url)
    const page = u.searchParams.get("page")
    return page
}

const TodayPage = () => {
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

    const filterContents = [
        "due_date",
        "assigned_at",
    ]

    const onClickErrorBox = () => {
        overdueRefetch()
        todayRefetch()
    }

    return (
        <>
            <PageTitle>Today</PageTitle>
            <OverdueTasksBlock>
                <OverdueTitle>
                    <FeatherIcon icon="alert-circle"/>
                    놓친 작업
                </OverdueTitle>
                <FilterButtonBox>
                    {filterContents.map(content=>(
                        <FilterButton 
                            key={content}
                            $isActive={filter === content}
                            onClick={()=>setFilter(content)}>
                            {content}
                        </FilterButton>
                    ))}
                </FilterButtonBox>
                <TasksBox>
                    {(isOverdueError || isTodayError) &&
                        <ErrorBox onClick={onClickErrorBox}>
                            불러오기를 실패했습니다
                        </ErrorBox>}
                    {isOverdueLoading && <SkeletonDueTasks taskCount={4} />}
                    {overdueTasks?.pages?.map((group) =>
                        group?.results?.map((task) => (
                            <OverdueTaskBox key={task.id}>
                                <Task task={task} color={"pink"} />
                                <Icons>
                                    <FeatherIcon icon="arrow-down"/>
                                    <FeatherIcon icon="arrow-right"/>
                                </Icons>
                            </OverdueTaskBox>
                        )),
                    )}
                </TasksBox>
                {overdueHasNextPage ? (
                    <MoreText onClick={() => overdueFetchNextPage()}>
                        {"더보기 "}
                        ({overdueTasks?.pages[0].count})
                    </MoreText>
                ) : null}
            </OverdueTasksBlock>
            <TasksBox>
                {isTodayLoading && <SkeletonDueTasks taskCount={10} />}
                {todayTasks?.pages?.map((group) =>
                    group?.results?.map((task) => (
                        <Task key={task.id} task={task} color={"pink"} />
                    )),
                )}
            </TasksBox>
            <FlexCenterBox>
                {todayHasNextPage ? (
                    <MoreButton onClick={() => todayFetchNextPage()}>
                        {"더보기"}
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

export default TodayPage
