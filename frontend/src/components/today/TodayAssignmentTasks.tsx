import { useState } from "react"

import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import LoaderCircle from "@components/common/LoaderCircle"
import TaskCreateButton from "@components/drawers/TaskCreateButton"
import { ErrorBox } from "@components/errors/ErrorProjectPage"
import { SkeletonDueTasks } from "@components/project/skeletons/SkeletonTodayPage"
import TaskCreateSimple from "@components/project/taskCreateSimple"
import TaskBlock from "@components/tasks/TaskBlock"

import { getDrawer } from "@api/drawers.api"
import { getTasksAssignedToday } from "@api/today.api"

import { getPageFromURL } from "@utils/pagination"
import { ifMobile } from "@utils/useScreenType"

import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

const TodayAssignmentTasks = ({ selectedDate }: { selectedDate: DateTime }) => {
    const { t } = useTranslation("translation")

    const [isSimpleOpen, setIsSimpleOpen] = useState(false)

    const {
        data,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isPending,
        isError,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["today", "assigned", selectedDate.toISODate()],
        queryFn: (pages) =>
            getTasksAssignedToday(selectedDate.toISODate()!, pages.pageParam),
        initialPageParam: "1",
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    const {
        isPending: isInboxPending,
        isError: isInboxError,
        data: inboxData,
        refetch: inboxRefetch,
    } = useQuery({
        queryKey: ["drawers", "inbox"],
        async queryFn() {
            return getDrawer("inbox")
        },
        enabled: isSimpleOpen,
    })

    const handleToggleSimpleCreate = () => {
        setIsSimpleOpen((prev) => !prev)
    }

    if (isError || isInboxError) {
        return (
            <ErrorBox
                onClick={() => {
                    if (isInboxError) {
                        setIsSimpleOpen(true)
                    }
                    refetch()
                    inboxRefetch()
                }}>
                {isError
                    ? t("today.error_load_task")
                    : t("today.error_load_inbox")}
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
                {isSimpleOpen &&
                    (isInboxPending ? (
                        <TaskCreateLoadingBox>
                            <LoaderCircle />
                            {t("common.loading")}
                        </TaskCreateLoadingBox>
                    ) : inboxData ? (
                        <TaskCreateSimple
                            drawer={inboxData}
                            onClose={() => setIsSimpleOpen(false)}
                            initAssignedAt={selectedDate}
                        />
                    ) : null)}
                <TaskCreateButton
                    isOpen={isSimpleOpen}
                    onClick={handleToggleSimpleCreate}
                />
            </TasksBox>
            {hasNextPage ? (
                <ButtonGroup $margin="1.3em 0em">
                    <MoreButton
                        disabled={isFetchingNextPage}
                        loading={isFetchingNextPage}
                        onClick={() => fetchNextPage()}>
                        {t("common.load_more")}
                    </MoreButton>
                </ButtonGroup>
            ) : null}
        </>
    )
}

const TasksBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0.3em 0.8em;
    overflow: hidden;
`

const MoreButton = styled(Button)`
    width: 25em;
`

const NoTaskText = styled.div`
    text-align: center;
    margin: 1em 0em;
    font-size: 1em;
    color: ${(p) => p.theme.secondTextColor};
`

const TaskCreateLoadingBox = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6em;
    height: 3.8em;
    margin: 0.5em 0em;
    margin-left: 1.7em;
    padding: 0 1.2em;
    border: 1.5px dashed ${(p) => p.theme.grey};
    border-radius: 15px;
    color: ${(p) => p.theme.secondTextColor};

    ${ifMobile} {
        margin-left: 0.8em;
    }
`

export default TodayAssignmentTasks
