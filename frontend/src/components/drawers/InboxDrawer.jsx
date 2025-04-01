import { useState } from "react"

import { useInfiniteQuery } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import TaskCreateButton from "@components/drawers/TaskCreateButton"
import { TaskErrorBox } from "@components/errors/ErrorProjectPage"
import TaskCreateSimple from "@components/project/TaskCreateSimple"
import DrawerTask from "@components/tasks/DrawerTask"

import { getTasksByDrawer } from "@api/tasks.api"

import { getPageFromURL } from "@utils/pagination"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const InboxDrawer = ({ project, drawer, color, ordering }) => {
    const [isSimpleOpen, setIsSimpleOpen] = useState(false)

    const { t } = useTranslation(null, { keyPrefix: "project" })

    const {
        data,
        isError,
        fetchNextPage,
        isLoading,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["tasks", { drawerID: drawer.id, ordering: ordering }],
        queryFn: (pages) =>
            getTasksByDrawer(drawer.id, ordering, pages.pageParam || 1),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    const hasNextPage = data?.pages[data?.pages?.length - 1].next !== null

    //TODO: Inbox Task Drag And Drop

    const handleToggleSimpleCreate = () => {
        setIsSimpleOpen((prev) => !prev)
    }

    if (isLoading) {
        return null
    }

    if (isError) {
        return (
            <TaskErrorBox onClick={refetch}>
                <FeatherIcon icon="alert-triangle" />
                {t("error_load_task")}
            </TaskErrorBox>
        )
    }

    return (
        <>
            <TaskList>
                {data?.pages?.map((group) =>
                    group?.results?.map((task) => (
                        <DrawerTask
                            key={task.id}
                            task={task}
                            color={color}
                            projectType={project.type}
                        />
                    )),
                )}
            </TaskList>
            {isSimpleOpen && (
                <TaskCreateSimple
                    projectID={project.id}
                    projectName={project.name}
                    drawerID={drawer.id}
                    drawerName={drawer.name}
                    color={color}
                    onClose={() => setIsSimpleOpen(false)}
                />
            )}
            <TaskCreateButton
                isOpen={isSimpleOpen}
                onClick={handleToggleSimpleCreate}
            />
            {hasNextPage ? (
                <ButtonGroup $justifyContent="center" $margin="1em">
                    <MoreButton
                        disabled={isFetchingNextPage}
                        loading={isFetchingNextPage}
                        onClick={() => fetchNextPage()}>
                        {isLoading ? t("loading") : t("button_load_more")}
                    </MoreButton>
                </ButtonGroup>
            ) : null}
        </>
    )
}

const TaskList = styled.div`
    margin-top: 1em;
`

const MoreButton = styled(Button)`
    max-width: 25em;
    width: 80vw;
`

export default InboxDrawer
