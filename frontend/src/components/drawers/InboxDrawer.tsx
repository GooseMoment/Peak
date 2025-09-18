import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from "react"

import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import TaskCreateButton from "@components/drawers/TaskCreateButton"
import { TaskErrorBox } from "@components/errors/ErrorProjectPage"
import { SkeletonInboxTask } from "@components/project/skeletons/SkeletonProjectPage"
import TaskCreateSimple from "@components/project/taskCreateSimple"
import DrawerTask from "@components/tasks/DrawerTask"

import { type Drawer } from "@api/drawers.api"
import { type Task, getTasksByDrawer, patchReorderTask } from "@api/tasks.api"

import HTML5toTouch from "@utils/html5ToTouch"
import { getPageFromURL } from "@utils/pagination"

import queryClient from "@queries/queryClient"

import FeatherIcon from "feather-icons-react"
import { DndProvider } from "react-dnd-multi-backend"
import { useTranslation } from "react-i18next"

interface InboxDrawerProps {
    drawer: Drawer
    ordering: string
    setOrdering: Dispatch<SetStateAction<string>>
}

const InboxDrawer = ({ drawer, ordering, setOrdering }: InboxDrawerProps) => {
    const [tasks, setTasks] = useState<Task[]>([])

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

    // Task Drag and Drop
    useEffect(() => {
        if (!data) return
        const results = data?.pages?.flatMap((page) => page.results ?? []) || []
        setTasks(results)
    }, [data])

    const patchMutation = useMutation({
        mutationFn: (data: Partial<Task>[]) => {
            return patchReorderTask(data)
        },
    })

    const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
        setTasks((prevTasks) => {
            const updatedTasks = [...prevTasks]
            const [moved] = updatedTasks.splice(dragIndex, 1)
            updatedTasks.splice(hoverIndex, 0, moved)
            return updatedTasks
        })
    }, [])

    const dropTask = useCallback(async () => {
        const results = data?.pages?.flatMap((page) => page.results) || []
        const changedTasks = tasks
            .map((task, index) => ({ id: task.id, order: index }))
            .filter((task, index) => results[index]?.id !== task.id)

        if (changedTasks.length === 0) return

        await patchMutation.mutateAsync(changedTasks)

        await queryClient.invalidateQueries({
            queryKey: ["tasks", { drawerID: drawer.id, ordering: "order" }],
        })
        setOrdering("order")
    }, [tasks, data])
    // ---

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
                    {tasks?.map((task) => (
                        <DrawerTask
                            key={task.id}
                            task={task}
                            moveTask={moveTask}
                            dropTask={dropTask}
                            isPending={patchMutation.isPending}
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
