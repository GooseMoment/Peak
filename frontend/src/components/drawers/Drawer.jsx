import { Suspense, lazy, useEffect, useMemo, useState } from "react"

import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import DeleteAlert from "@components/common/DeleteAlert"
import ModalLoader from "@components/common/ModalLoader"
import ModalWindow from "@components/common/ModalWindow"
import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import DrawerIcons from "@components/drawers/DrawerIcons"
import TaskCreateButton from "@components/drawers/TaskCreateButton"
import { TaskErrorBox } from "@components/errors/ErrorProjectPage"
import TaskCreateSimple from "@components/project/TaskCreateSimple"
import PrivacyIcon from "@components/project/common/PrivacyIcon"
import DrawerEdit from "@components/project/edit/DrawerEdit"
import { SkeletonDrawer } from "@components/project/skeletons/SkeletonProjectPage"
import SortMenuMobile from "@components/project/sorts/SortMenuMobile"
import DrawerTask from "@components/tasks/DrawerTask"

import { deleteDrawer } from "@api/drawers.api"
import { patchDrawer } from "@api/drawers.api"
import { getTasksByDrawer } from "@api/tasks.api"

import { getPageFromURL } from "@utils/pagination"

import queryClient from "@queries/queryClient"

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskCreateElement = lazy(
    () => import("@components/project/taskDetails/TaskCreateElement"),
)

const Drawer = ({ project, drawer, color }) => {
    const [collapsed, setCollapsed] = useState(false)
    const [ordering, setOrdering] = useState(null)
    const [isSortMenuMobileOpen, setSortMenuMobileOpen] = useState(false)
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [isDrawerEditOpen, setIsDrawerEditOpen] = useState(false)
    const [isSimpleOpen, setIsSimpleOpen] = useState(false)
    const [isCreateOpen, setCreateOpen] = useState(false)

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

    const patchMutation = useMutation({
        mutationFn: (data) => {
            return patchDrawer(drawer.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: drawer.id }],
            })
        },
    })

    const onDrop = ({ location, source }) => {
        const targetData = location.current.dropTargets[0]?.data
        const draggedOrder = source?.data.order

        if (targetData === undefined || draggedOrder === undefined) {
            return
        }

        const targetOrder = targetData?.order
        const symbolProperties = Object.getOwnPropertySymbols(targetData)
        const closestEdge = targetData[symbolProperties[0]]
        const taskID = source?.data.id

        if (typeof targetOrder !== "number" || draggedOrder === targetOrder) {
            return
        }

        patchMutation.mutate({
            task_id: taskID,
            dragged_order: draggedOrder,
            target_order: targetOrder,
            closest_edge: closestEdge,
        })
        setOrdering(null)
    }

    useEffect(() => {
        const cleanupMonitor = monitorForElements({
            onDrop: onDrop,
        })

        return () => {
            cleanupMonitor()
        }
    }, [])

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
        if (project.type === "inbox") return null
        return <SkeletonDrawer taskCount={taskCount} />
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
            {project.type === "inbox" ? null : (
                <DrawerBox $color={color}>
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
`

const MoreButton = styled(Button)`
    max-width: 25em;
    width: 80vw;
`

const makeSortMenuItems = (t) => [
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
