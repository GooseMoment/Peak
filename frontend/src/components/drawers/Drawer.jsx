import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"

import styled, { useTheme } from "styled-components"
import FeatherIcon from 'feather-icons-react'

import Button from "@components/common/Button"
import Task from "@components/tasks/Task"
import ContextMenu from "@components/common/ContextMenu"
import DeleteAlert from "@components/common/DeleteAlert"
import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import SortMenu from "@components/project/sorts/SortMenu"
import DrawerIcons from "./DrawerIcons"
import { SkeletonDrawer } from "@components/project/skeletons/SkeletonProjectPage"
import { TaskErrorBox } from "@components/errors/ErrorProjectPage"

import queryClient from "@queries/queryClient"
import { useMutation, useInfiniteQuery } from "@tanstack/react-query"
import { deleteDrawer } from "@api/drawers.api"
import { getTasksByDrawer } from "@api/tasks.api"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

const getPageFromURL = (url) => {
    if (!url) return null
    
    const u = new URL(url)
    const page = u.searchParams.get("page")
    return page
}

const Drawer = ({project, drawer, color}) => {
    const theme = useTheme()
    const navigate = useNavigate()

    const [collapsed, setCollapsed] = useState(false)
    const [ordering, setOrdering] = useState("created_at")
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
    const [selectedSortMenuPosition, setSelectedSortMenuPosition] = useState({top: 0, left: 0})
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [selectedContextPosition, setSelectedContextPosition] = useState({top: 0, left: 0})
    const [isSimpleOpen, setIsSimpleOpen] = useState(false)

    const { t } = useTranslation(null, {keyPrefix: "project"})

    const { data, isError, fetchNextPage, isLoading, refetch } = useInfiniteQuery({
        queryKey: ["tasks", {drawerID: drawer.id, ordering: ordering}],
        queryFn: (pages) => getTasksByDrawer(drawer.id, ordering, pages.pageParam || 1),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    const hasNextPage = data?.pages[data?.pages?.length-1].next !== null

    useEffect(() => {
        setIsContextMenuOpen(false)
        setIsSortMenuOpen(false)
    }, [project])

    const deleteMutation = useMutation({
        mutationFn: () => {
            return deleteDrawer(drawer.id)
        },
        onSuccess: () => {
            toast.success(t("delete.drawer_delete_success", {drawer_name: drawer.name}))
            queryClient.invalidateQueries({queryKey: ['drawers', {projectID: project.id}]})
        },
        onError: () => {
            toast.success(t("delete.drawer_delete_error", {drawer_name: drawer.name}))
        }
    })

    const handleAlert = () => {
        setIsContextMenuOpen(false)
        setIsAlertOpen(true)
    }

    const sortMenuItems = useMemo(() => makeSortMenuItems(t), [t])
    const contextMenuItems = useMemo(() => makeContextMenuItems(t, theme, handleAlert), [t, theme])

    const handleToggleSimpleCreate = () => {
        setIsSimpleOpen(prev => !prev)
    }

    const handleCollapsed = () => {
        {drawer.task_count !== 0 && setCollapsed(prev => !prev)}
    }

    const clickPlus = () => {
        navigate(`/app/projects/${project.id}/tasks/create/`,
        {state: {project_name : project.name, drawer_id : drawer.id, drawer_name : drawer.name}})
    }

    if (isLoading) {
        return <SkeletonDrawer/>
    }

    if (isError) {
        return (
            <TaskErrorBox onClick={() => refetch()}>
                <FeatherIcon icon="alert-triangle"/>
                {t("error_load_task")}
            </TaskErrorBox>
        )
    }

    return (
        <>
            {project.type === 'inbox' ? null :
            <DrawerBox $color = {color}>
                <DrawerName $color = {color}>{drawer.name}</DrawerName>
                <DrawerIcons
                    color={color}
                    collapsed={collapsed}
                    handleCollapsed={handleCollapsed}
                    clickPlus={clickPlus}
                    setIsSortMenuOpen={setIsSortMenuOpen}
                    setSelectedSortMenuPosition={setSelectedSortMenuPosition}
                    setIsContextMenuOpen={setIsContextMenuOpen}
                    setSelectedContextPosition={setSelectedContextPosition}
                />
            </DrawerBox>}
            {collapsed ? null :
                <TaskList>
                    {data?.pages?.map((group) => (
                        group?.results?.map((task) =>
                            <Task key={task.id} task={task} color={color}/>
                    )))}
                </TaskList>
            }
            {isSortMenuOpen &&
                <SortMenu
                    title={t("sort.task_title")}
                    items={sortMenuItems}
                    selectedButtonPosition={selectedSortMenuPosition}
                    ordering={ordering}
                    setOrdering={setOrdering}
                />
            }
            {isContextMenuOpen &&
                <ContextMenu
                    items={contextMenuItems}
                    selectedButtonPosition={selectedContextPosition}
                />
            }
            {isAlertOpen &&
                <DeleteAlert 
                    title={t("delete.alert_drawer_title", {drawer_name: drawer.name})}
                    onClose={() => {setIsAlertOpen(false)}}
                    func={deleteMutation.mutate}
                />
            }
            {/*isSimpleOpen &&
                <TaskCreateSimple 
                    color={color}
                    drawer_id={drawer.id}
                    drawer_name={drawer.name}
                    project_name={project.name}
                />
            */}
            <TaskCreateButton onClick={handleToggleSimpleCreate}>
                <FeatherIcon icon="plus-circle"/>
                <TaskCreateText>{t("button_add_task")}</TaskCreateText>
            </TaskCreateButton>
            <FlexBox>
                {hasNextPage ? <MoreButton onClick={() => fetchNextPage()}>{t("button_load_more")}</MoreButton> : null}
            </FlexBox>
        </>
    );
}

export const TaskList = styled.div`
    flex: 1;
    margin-left: 0.5em;
`

const TaskCreateButton = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    margin-left: 1.9em;
    margin-top: 1.8em;
    
    &:hover {
        cursor: pointer;
    }

    & svg {
        text-align: center;
        width: 1.1em;
        height: 1.1em;
        top: 0;
    } 
`

const TaskCreateText = styled.div`
    font-size: 1.1em;
    font-weight: medium;
    color: ${p => p.theme.textColor};
    margin-top: 0em;
`

const FlexBox = styled.div`
    display: flex;
    margin-top: 1em;
    align-items: center;
    justify-content: center;
`

const MoreButton = styled(Button)`
    width: 25em;
`

const makeSortMenuItems = (t) => [
    {"display": t("sort.-priority"), "context": "-priority"},
    {"display": t("sort.due_date"), "context": "assigned_at,due_date,due_time"},
    {"display": t("sort.-due_date"), "context": "-assigned_at,-due_date,-due_time"},
    {"display": t("sort.name"), "context": "name"},
    {"display": t("sort.-name"), "context": "-name"},
    {"display": t("sort.created_at"), "context": "created_at"},
    {"display": t("sort.-created_at"), "context": "-created_at"},
    {"display": t("sort.reminders"), "context": "reminders"},
]

const makeContextMenuItems = (t, theme, handleAlert) => [
    {"icon": "edit", "display": t("edit.display"), "color": theme.textColor, "func": () => {}},
    {"icon": "trash-2", "display": t("delete.display"), "color": theme.project.danger, "func": handleAlert}
]

export default Drawer