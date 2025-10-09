import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react"

import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import TaskCreateButton from "@components/drawers/TaskCreateButton"
import { TaskErrorBox } from "@components/errors/ErrorProjectPage"
import { SkeletonInboxTask } from "@components/project/skeletons/SkeletonProjectPage"
import TaskCreateSimple from "@components/project/taskCreateSimple"
import DrawerTask from "@components/tasks/DrawerTask"

import type { Drawer } from "@api/drawers.api"
import { type Task, getTasksByDrawer, patchReorderTask } from "@api/tasks.api"

import HTML5toTouch from "@utils/html5ToTouch"
import { getPageFromURL } from "@utils/pagination"

import queryClient from "@queries/queryClient"

import FeatherIcon from "feather-icons-react"
import { DndProvider } from "react-dnd-multi-backend"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

interface InboxDrawerProps {
    drawer: Drawer
    ordering: string
    setOrdering: Dispatch<SetStateAction<string>>
}

const InboxDrawer = ({ drawer, ordering, setOrdering }: InboxDrawerProps) => {
    const [isSimpleOpen, setIsSimpleOpen] = useState(false)

    const { t } = useTranslation("translation")

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

    const tasks = useMemo(() => {
        if (!data) return []
        return data?.pages?.flatMap((page) => page.results ?? []) || []
    }, [data])

    // Task Drag and Drop - using local state for temporary reordering
    const [tempTaskOrder, setTempTaskOrder] = useState<Task[]>([])

    // Use temp order if available, otherwise use derived tasks
    const displayTasks = tempTaskOrder.length > 0 ? tempTaskOrder : tasks

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data: Partial<Task>[]) => {
            return patchReorderTask(data)
        },
    })

    const moveTask = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            const updatedTasks = [...displayTasks]
            const [moved] = updatedTasks.splice(dragIndex, 1)
            updatedTasks.splice(hoverIndex, 0, moved)
            setTempTaskOrder(updatedTasks)
        },
        [displayTasks],
    )

    const dropTask = useCallback(async () => {
        const changedTasks = displayTasks
            .map((task, index) => ({ id: task.id, order: index }))
            .filter((task, index) => tasks[index]?.id !== task.id)

        if (changedTasks.length === 0) {
            setTempTaskOrder([])
            return
        }

        try {
            await mutateAsync(changedTasks)
            await queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: drawer.id, ordering: "order" }],
            })
        } catch (_) {
            toast.error(t("common.error_perform"))
        } finally {
            setTempTaskOrder([])
            setOrdering("order")
        }
    }, [tasks, displayTasks, t, drawer.id, mutateAsync, setOrdering])

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
                {t("project.error_load_inbox")}
            </TaskErrorBox>
        )
    }

    return (
        <>
            <DndProvider options={HTML5toTouch}>
                <TaskList>
                    {displayTasks.map((task) => (
                        <DrawerTask
                            key={task.id}
                            task={task}
                            moveTask={moveTask}
                            dropTask={dropTask}
                            isPending={isPending}
                        />
                    ))}
                </TaskList>
            </DndProvider>
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
                        {isLoading
                            ? t("common.loading")
                            : t("common.load_more")}
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
