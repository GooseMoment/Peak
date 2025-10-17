import { useInfiniteQuery } from "@tanstack/react-query"
import styled from "styled-components"

import Button from "@components/common/Button"
import { ErrorBox } from "@components/errors/ErrorProjectPage"
import { SkeletonDueTasks } from "@components/project/skeletons/SkeletonTodayPage"
import TaskBlock from "@components/tasks/TaskBlock"

import { getTasksAssignedToday } from "@api/today.api"

import { getPageFromURL } from "@utils/pagination"

import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

const TodayAssignmentTasks = ({ selectedDate }: { selectedDate: DateTime }) => {
    const { t } = useTranslation("translation")

    const { data, hasNextPage, fetchNextPage, isPending, isError, refetch } =
        useInfiniteQuery({
            queryKey: ["today", "assigned", selectedDate],
            queryFn: (pages) =>
                getTasksAssignedToday(
                    selectedDate.toISODate()!,
                    pages.pageParam,
                ),
            initialPageParam: "1",
            getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
        })

    if (isError) {
        return (
            <ErrorBox onClick={() => refetch()}>
                {t("today.error_load_task")}
            </ErrorBox>
        )
    }

    if (isPending) {
        return (
            <TasksBox>
                <SkeletonDueTasks taskCount={10} />
            </TasksBox>
        )
    }

    return (
        <>
            <TasksBox>
                {data.pages[0].results.length === 0 ? (
                    <NoTaskText>{t("today.no_today_assignment")}</NoTaskText>
                ) : (
                    data.pages.map((group) =>
                        group.results.map((task) => (
                            <TaskBlock key={task.id} task={task} />
                        )),
                    )
                )}
            </TasksBox>
            <FlexCenterBox>
                {hasNextPage ? (
                    <MoreButton onClick={() => fetchNextPage()}>
                        {t("common.load_more")}
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
