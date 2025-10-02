import {
    Suspense,
    lazy,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"

import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import DeleteAlert from "@components/common/DeleteAlert"
import ModalLoader from "@components/common/ModalLoader"
import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import DrawerIcons from "@components/drawers/DrawerIcons"
import TaskCreateButton from "@components/drawers/TaskCreateButton"
import { TaskErrorBox } from "@components/errors/ErrorProjectPage"
import PrivacyIcon from "@components/project/common/PrivacyIcon"
import DrawerEdit from "@components/project/edit/DrawerEdit"
import { SkeletonTasks } from "@components/project/skeletons/SkeletonProjectPage"
import SortMenuMobile from "@components/project/sorts/SortMenuMobile"
import TaskCreateSimple from "@components/project/taskCreateSimple"
import DrawerTask from "@components/tasks/DrawerTask"

import { type Drawer, deleteDrawer } from "@api/drawers.api"
import { type Task, getTasksByDrawer, patchReorderTask } from "@api/tasks.api"

import { getPageFromURL } from "@utils/pagination"
import useModal, { Portal } from "@utils/useModal"

import queryClient from "@queries/queryClient"

import { usePaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"
import type { TFunction } from "i18next"
import { useDrag, useDrop } from "react-dnd"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskCreateElement = lazy(
    () => import("@components/project/taskDetails/TaskCreateElement"),
)

interface DrawerBlockProps {
    drawer: Drawer
    moveDrawer: (dragIndex: number, hoverIndex: number) => void
    dropDrawer: () => void
}

const DrawerBlock = ({ drawer, moveDrawer, dropDrawer }: DrawerBlockProps) => {
    const [collapsed, setCollapsed] = useState(false)
    const [ordering, setOrdering] = useState("order")
    const [isSortMenuMobileOpen, setSortMenuMobileOpen] = useState(false)
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [isSimpleOpen, setIsSimpleOpen] = useState(false)
    const [isCreateOpen, setCreateOpen] = useState(false)
    const modal = useModal()

    const [tasks, setTasks] = useState<Task[]>([])

    const { t } = useTranslation("translation")

    const sortMenuItems = useMemo(() => makeSortMenuItems(t), [t])

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

    /// Drawer Drag and Drop
    const ref = useRef<HTMLDivElement>(null)

    const [{ handlerId }, drop] = useDrop({
        accept: "Drawer",
        canDrop: (item: Drawer) => item.order !== drawer.order,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover: (item, monitor) => {
            if (!ref.current) return

            const dragOrder = item.order
            const hoverOrder = drawer.order

            if (dragOrder === hoverOrder) return

            const hoverBoundingRect = ref.current.getBoundingClientRect()
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const clientOffset = monitor.getClientOffset()

            if (!clientOffset) return
            const hoverClientY = clientOffset.y - hoverBoundingRect.top

            if (dragOrder < hoverOrder && hoverClientY < hoverMiddleY) return
            if (dragOrder > hoverOrder && hoverClientY > hoverMiddleY) return

            if (item.order !== hoverOrder) {
                item.order = hoverOrder
                moveDrawer(dragOrder, hoverOrder)
            }
        },
        drop: (item) => {
            item.order = drawer.order
            dropDrawer()
        },
    })

    const [{ isDragging }, drag] = useDrag({
        type: "Drawer",
        item: () => {
            return { id: drawer.id, order: drawer.order }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    drag(drop(ref))
    /// ---

    // Task Drag and Drop
    useEffect(() => {
        if (!data) return
        const results = data.pages.flatMap((page) => page.results ?? []) || []
        setTasks(results)
    }, [data])

    const { mutateAsync, isPending } = useMutation({
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
        const results = data?.pages.flatMap((page) => page.results) || []
        const changedTasks = tasks
            .map((task, index) => ({ id: task.id, order: index }))
            .filter((task, index) => results[index]?.id !== task.id)

        if (changedTasks.length === 0) return

        await mutateAsync(changedTasks)

        await queryClient.invalidateQueries({
            queryKey: ["tasks", { drawerID: drawer.id, ordering: "order" }],
        })
        setOrdering("order")
    }, [tasks, data, drawer.id, mutateAsync])
    // ---

    const deleteMutation = useMutation({
        mutationFn: () => {
            return deleteDrawer(drawer.id)
        },
        onSuccess: () => {
            toast.success(
                t("project.delete.drawer_delete_success", {
                    drawer_name: drawer.name,
                }),
            )
            queryClient.invalidateQueries({
                queryKey: ["drawers", { projectID: drawer.project.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["projects", drawer.project.id],
            })
        },
        onError: () => {
            toast.success(
                t("project.delete.drawer_delete_error", {
                    drawer_name: drawer.name,
                }),
            )
        },
    })

    const handleToggleSimpleCreate = () => {
        setIsSimpleOpen((prev) => !prev)
    }

    const taskCount =
        drawer.uncompleted_task_count + drawer.completed_task_count

    const handleCollapsed = () => {
        if (taskCount !== 0) setCollapsed((prev) => !prev)
    }

    const clickPlus = () => {
        setCreateOpen(true)
    }

    const color = usePaletteColor(drawer.project.color)

    if (isError) {
        return (
            <TaskErrorBox onClick={() => refetch()}>
                <FeatherIcon icon="alert-triangle" />
                {t("project.error_load_task")}
            </TaskErrorBox>
        )
    }

    return (
        <>
            <DrawerBox
                ref={ref}
                data-handler-id={handlerId}
                $color={color}
                $isDragging={isDragging}
                $isDraggable={true}>
                <DrawerTitleBox>
                    <DrawerName $color={color}>{drawer.name}</DrawerName>
                    <PrivacyIcon privacy={drawer.privacy} color={color} />
                </DrawerTitleBox>
                <DrawerIcons
                    color={color}
                    collapsed={collapsed}
                    handleCollapsed={handleCollapsed}
                    clickPlus={clickPlus}
                    items={sortMenuItems}
                    openSortMenuMobile={() => setSortMenuMobileOpen(true)}
                    ordering={ordering}
                    setOrdering={setOrdering}
                    handleEdit={() => modal.openModal()}
                    handleAlert={() => setIsAlertOpen(true)}
                />
            </DrawerBox>
            {collapsed ? null : isLoading ? (
                <SkeletonTasks taskCount={taskCount} />
            ) : (
                <TaskList $isDragging={isDragging}>
                    {tasks?.map((task) => (
                        <DrawerTask
                            key={task.id}
                            task={task}
                            moveTask={moveTask}
                            dropTask={dropTask}
                            isPending={isPending}
                        />
                    ))}
                </TaskList>
            )}
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
            {isLoading ||
                (hasNextPage ? (
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
                ) : null)}
            {isSortMenuMobileOpen && (
                <SortMenuMobile
                    title={t("project.sort.task_title")}
                    items={sortMenuItems}
                    onClose={() => setSortMenuMobileOpen(false)}
                    ordering={ordering}
                    setOrdering={setOrdering}
                />
            )}
            {isAlertOpen && (
                <DeleteAlert
                    title={t("project.delete.alert_drawer_title", {
                        drawer_name: drawer.name,
                    })}
                    onClose={() => {
                        setIsAlertOpen(false)
                    }}
                    func={deleteMutation.mutate}
                />
            )}
            <Portal modal={modal}>
                <DrawerEdit drawer={drawer} />
            </Portal>
            {isCreateOpen && (
                <Suspense key="task-create-drawer" fallback={<ModalLoader />}>
                    <TaskCreateElement
                        drawer={drawer}
                        onClose={() => setCreateOpen(false)}
                    />
                </Suspense>
            )}
        </>
    )
}

const DrawerTitleBox = styled.div`
    display: flex;
    align-items: center;
`

const TaskList = styled.div<{ $isDragging: boolean }>`
    margin-top: 1em;
    opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
`

const MoreButton = styled(Button)`
    max-width: 25em;
    width: 80vw;
`

const makeSortMenuItems = (t: TFunction<"translation", "project">) => [
    { display: t("sort.my"), context: "order" },
    { display: t("sort.-priority"), context: "-priority" },
    { display: t("sort.due_date"), context: "due_date" },
    {
        display: t("sort.-due_date"),
        context: "-due_date",
    },
    { display: t("sort.name"), context: "name" },
    { display: t("sort.-name"), context: "-name" },
    { display: t("sort.created_at"), context: "created_at" },
    { display: t("sort.-created_at"), context: "-created_at" },
    { display: t("sort.reminders"), context: "reminders" },
]

export default DrawerBlock
