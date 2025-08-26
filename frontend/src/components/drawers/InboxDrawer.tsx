import { useState } from "react"

import { useInfiniteQuery } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import TaskCreateButton from "@components/drawers/TaskCreateButton"
import { TaskErrorBox } from "@components/errors/ErrorProjectPage"
import { SkeletonInboxTask } from "@components/project/skeletons/SkeletonProjectPage"
import TaskCreateSimple from "@components/project/taskCreateSimple"
import DrawerTask from "@components/tasks/DrawerTask"

import { type Drawer } from "@api/drawers.api"
import { getTasksByDrawer } from "@api/tasks.api"

import { getPageFromURL } from "@utils/pagination"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

interface InboxDrawerProps {
    drawer: Drawer
    ordering: string
}

const InboxDrawer = ({ drawer, ordering }: InboxDrawerProps) => {
    const [isSimpleOpen, setIsSimpleOpen] = useState(false)

    const { t } = useTranslation("translation", { keyPrefix: "project" })

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
            getTasksByDrawer(drawer.id, ordering, pages.pageParam),
        initialPageParam: "1",
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    const hasNextPage = data?.pages[data?.pages?.length - 1].next !== null

    //TODO: Inbox Task Drag And Drop

    const handleToggleSimpleCreate = () => {
        setIsSimpleOpen((prev) => !prev)
    }

    if (isLoading) {
        return <SkeletonInboxTask />
    }

    if (isError) {
        return (
            <TaskErrorBox onClick={() => refetch()}>
                <FeatherIcon icon="alert-triangle" />
                {t("error_load_inbox")}
            </TaskErrorBox>
        )
    }

    return (
        <>
            <TaskList>
                {data?.pages?.map((group) =>
                    group?.results?.map((task) => (
                        <DrawerTask key={task.id} task={task} />
                    )),
                )}
            </TaskList>
            {isSimpleOpen && (
                <TaskCreateSimple
                    drawer={drawer}
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
