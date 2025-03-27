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
import ModalWindow from "@components/common/ModalWindow"
import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import DrawerIcons from "@components/drawers/DrawerIcons"
import { TaskErrorBox } from "@components/errors/ErrorProjectPage"
import TaskCreateSimple from "@components/project/TaskCreateSimple"
import PrivacyIcon from "@components/project/common/PrivacyIcon"
import DrawerEdit from "@components/project/edit/DrawerEdit"
import {
    SkeletonDrawer,
    SkeletonInboxDrawer,
} from "@components/project/skeletons/SkeletonProjectPage"
import SortMenuMobile from "@components/project/sorts/SortMenuMobile"
import DrawerTask from "@components/tasks/DrawerTask"

import { deleteDrawer } from "@api/drawers.api"
import { getTasksByDrawer, patchReorderTask } from "@api/tasks.api"

import { getPageFromURL } from "@utils/pagination"

import queryClient from "@queries/queryClient"

import FeatherIcon from "feather-icons-react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskCreateElement = lazy(
    () => import("@components/project/taskDetails/TaskCreateElement"),
)

const Drawer = ({ project, drawer, color, moveDrawer, dropDrawer }) => {
    const [collapsed, setCollapsed] = useState(false)
    const [ordering, setOrdering] = useState("order")
    const [isSortMenuMobileOpen, setSortMenuMobileOpen] = useState(false)
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [isDrawerEditOpen, setIsDrawerEditOpen] = useState(false)
    const [isSimpleOpen, setIsSimpleOpen] = useState(false)
    const [isCreateOpen, setCreateOpen] = useState(false)

    const [tasks, setTasks] = useState([])

    const { t } = useTranslation(null, { keyPrefix: "project" })

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
            getTasksByDrawer(drawer.id, ordering, pages.pageParam || 1),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    const hasNextPage = data?.pages[data?.pages?.length - 1].next !== null

    /// Drawer Drag and Drop
    const ref = useRef(null)

    const [{ handlerId }, drop] = useDrop({
        accept: "Drawer",
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
            const hoverClientY = clientOffset.y - hoverBoundingRect.top

            if (dragOrder < hoverOrder && hoverClientY < hoverMiddleY) return
            if (dragOrder > hoverOrder && hoverClientY > hoverMiddleY) return

            moveDrawer(dragOrder, hoverOrder)

            item.order = hoverOrder
        },
        drop: (item) => {
            dropDrawer()
            item.order = drawer.order
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
        const results = data?.pages?.flatMap((page) => page.results ?? []) || []
        setTasks(results)
    }, [data])

    const patchMutation = useMutation({
        mutationFn: (data) => {
            return patchReorderTask(data)
        },
    })

    const moveTask = useCallback((dragIndex, hoverIndex) => {
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

        await queryClient.refetchQueries({
            queryKey: ["tasks", { drawerID: drawer.id, ordering: "order" }],
        })
        setOrdering("order")
    }, [tasks, data])
    // ---

    const deleteMutation = useMutation({
        mutationFn: () => {
            return deleteDrawer(drawer.id)
        },
        onSuccess: () => {
            toast.success(
                t("delete.drawer_delete_success", { drawer_name: drawer.name }),
            )
            queryClient.invalidateQueries({
                queryKey: ["drawers", { projectID: project.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["projects", project.id],
            })
        },
        onError: () => {
            toast.success(
                t("delete.drawer_delete_error", { drawer_name: drawer.name }),
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

    if (isLoading) {
        if (project.type === "inbox")
            return <SkeletonInboxDrawer taskCount={taskCount} />
        return <SkeletonDrawer taskCount={taskCount} />
    }

    if (isError) {
        return (
            <TaskErrorBox onClick={() => refetch()}>
                <FeatherIcon icon="alert-triangle" />
                {t("error_load_task")}
            </TaskErrorBox>
        )
    }

    return (
        <>
            {project.type === "inbox" ? null : (
                <DrawerBox
                    ref={ref}
                    data-handler-id={handlerId}
                    $color={color}
                    $isDragging={isDragging}>
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
                        handleEdit={() => setIsDrawerEditOpen(true)}
                        handleAlert={() => setIsAlertOpen(true)}
                    />
                </DrawerBox>
            )}
            {collapsed ? null : (
                <>
                    <TaskList $isDragging={isDragging}>
                        <DndProvider backend={HTML5Backend}>
                            {tasks?.map((task) => (
                                <DrawerTask
                                    key={task.id}
                                    task={task}
                                    color={color}
                                    projectType={project.type}
                                    moveTask={moveTask}
                                    dropTask={dropTask}
                                    isPending={patchMutation.isPending}
                                />
                            ))}
                        </DndProvider>
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
                    <TaskCreateButton onClick={handleToggleSimpleCreate}>
                        {isSimpleOpen ? (
                            <>
                                <FeatherIcon icon="x-circle" />
                                <TaskCreateText>
                                    {t("button_close_add_task")}
                                </TaskCreateText>
                            </>
                        ) : (
                            <>
                                <FeatherIcon icon="plus-circle" />
                                <TaskCreateText>
                                    {t("button_add_task")}
                                </TaskCreateText>
                            </>
                        )}
                    </TaskCreateButton>
                    {hasNextPage ? (
                        <ButtonGroup $justifyContent="center" $margin="1em">
                            <MoreButton
                                disabled={isFetchingNextPage}
                                loading={isFetchingNextPage}
                                onClick={() => fetchNextPage()}>
                                {isLoading
                                    ? t("loading")
                                    : t("button_load_more")}
                            </MoreButton>
                        </ButtonGroup>
                    ) : null}
                </>
            )}
            {isSortMenuMobileOpen && (
                <SortMenuMobile
                    title={t("sort.task_title")}
                    items={sortMenuItems}
                    onClose={() => setSortMenuMobileOpen(false)}
                    ordering={ordering}
                    setOrdering={setOrdering}
                />
            )}
            {isAlertOpen && (
                <DeleteAlert
                    title={t("delete.alert_drawer_title", {
                        drawer_name: drawer.name,
                    })}
                    onClose={() => {
                        setIsAlertOpen(false)
                    }}
                    func={deleteMutation.mutate}
                />
            )}
            {isDrawerEditOpen && (
                <ModalWindow
                    afterClose={() => {
                        setIsDrawerEditOpen(false)
                    }}>
                    <DrawerEdit projectID={project.id} drawer={drawer} />
                </ModalWindow>
            )}
            {isCreateOpen && (
                <Suspense key="task-create-drawer" fallback={<ModalLoader />}>
                    <TaskCreateElement
                        onClose={() => setCreateOpen(false)}
                        project={project}
                        drawer={drawer}
                        color={color}
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

const TaskList = styled.div`
    margin-top: 1em;
    opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
`

const TaskCreateButton = styled.div`
    display: flex;
    align-items: center;
    margin-top: 1em;
    margin-left: 1.9em;
    cursor: pointer;

    & svg {
        width: 1.1em;
        height: 1.1em;
        top: 0;
    }
`

const TaskCreateText = styled.div`
    font-size: 1.1em;
    font-weight: medium;
    color: ${(p) => p.theme.textColor};
    margin-top: 0em;
`

const MoreButton = styled(Button)`
    max-width: 25em;
    width: 80vw;
`

const makeSortMenuItems = (t) => [
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

export default Drawer
