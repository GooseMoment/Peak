import { Fragment, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { cubicBeizer, rotateToUp, rotateToUnder } from "@assets/keyframes"
import styled, { css, useTheme } from "styled-components"
import FeatherIcon from 'feather-icons-react'

import Button from "@components/common/Button"
import Task from "@components/tasks/Task"
import ContextMenu from "@components/common/ContextMenu"
import DeleteAlert from "@components/common/DeleteAlert"
import ModalPortal from "@components/common/ModalPortal"
import DrawerBox, { DrawerName, DrawerIcon } from "@components/drawers/DrawerBox"

import { useMutation, useInfiniteQuery } from "@tanstack/react-query"
import { deleteDrawer } from "@api/drawers.api"
import { getTasksByDrawer } from "@api/tasks.api"
import queryClient from "@queries/queryClient"
import handleToggleContextMenu from "@utils/handleToggleContextMenu"
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
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [selectedButtonPosition, setSelectedButtonPosition] = useState({top: 0, left: 0})
    const [isSimpleOpen, setIsSimpleOpen] = useState(false)

    const { t } = useTranslation(null, {keyPrefix: "project"})

    const { data, isError, fetchNextPage, isLoading } = useInfiniteQuery({
        queryKey: ["tasks", {drawerID: drawer.id}],
        queryFn: (pages) => getTasksByDrawer(drawer.id, pages.pageParam || 1),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    useEffect(() => {
        setIsContextMenuOpen(false)
    }, [project])

    const hasNextPage = data?.pages[data?.pages?.length-1].next !== null

    const handleCollapsed = () => {
        {drawer.task_count !== 0 && setCollapsed(prev => !prev)}
    }

    const deleteMutation = useMutation({
        mutationFn: () => {
            return deleteDrawer(drawer.id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['projects', project.id]})
        },
    })

    const handleAlert = () => {
        return async () => {
            setIsContextMenuOpen(false)
            setIsAlertOpen(true)
        }
    }

    const contextMenuItems = makeContextMenuItems(theme, handleAlert)

    const handleDelete = () => {
        deleteMutation.mutate()
        toast.success(`"${drawer.name}" 서랍이 삭제되었습니다`)
    }

    const handleToggleSimpleCreate = () => {
        setIsSimpleOpen(prev => !prev)
    }

    const clickPlus = () => {
        navigate(`/app/projects/${project.id}/tasks/create/`,
        {state: {project_name : project.name, drawer_id : drawer.id, drawer_name : drawer.name}})
    }

    const drawerIcons = [
        {icon: <FeatherIcon icon={"plus"} onClick={clickPlus}/>},
        {icon: <CollapseButton $collapsed={collapsed}>
            <FeatherIcon icon={"chevron-down"} onClick={handleCollapsed}/>
        </CollapseButton>},
        {icon: <FeatherIcon icon={"more-horizontal"} onClick={handleToggleContextMenu(setSelectedButtonPosition, setIsContextMenuOpen)}/>},
    ]

    if (isError) {
        return (
            <>
                <div>{t("error_load_task")}</div>
                <div onClick={() => navigate(-1)}>{t("button_go_back")}</div>
            </>
        )
    }

    if (isLoading) {
        return <div>로딩중..</div>
    }
    
    return (
        <>
            {project.type === 'inbox' ? <div/> :
            <DrawerBox $color = {color}>
                <DrawerName $color = {color}>{drawer.name}</DrawerName>
                <DrawerIcon $color = {color}>
                    {drawerIcons.map((item, i) => (
                        <Fragment key={i}>{item.icon}</Fragment>
                    ))}
                </DrawerIcon>
            </DrawerBox>}
            {collapsed ? null :
                <TaskList>
                    {data?.pages?.map((group) => (
                        group?.results?.map((task) =>
                            <Task key={task.id} task={task} color={color}/>
                    )))}
                </TaskList>
            }
            {isContextMenuOpen &&
                <ContextMenu
                    items={contextMenuItems}
                    selectedButtonPosition={selectedButtonPosition}
                />
            }
            {isAlertOpen &&
                <ModalPortal closeModal={() => {setIsAlertOpen(false)}}>
                    <DeleteAlert title={`"${drawer.name}" 서랍을`} onClose={() => {setIsAlertOpen(false)}} func={handleDelete}/>
                </ModalPortal>
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

const CollapseButton = styled.div`
    & svg {
        animation: ${rotateToUp} 0.5s ${cubicBeizer} forwards;
    }

    ${props => props.$collapsed && css`
        & svg {
            animation: ${rotateToUnder} 0.5s ${cubicBeizer} forwards;
        }
    `}
`

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

const makeContextMenuItems = (theme, handleAlert) => [
    {"icon": "trash-2", "display": "Delete", "color": theme.project.danger, "func": handleAlert()}, 
    {"icon": "chevrons-down", "display": "Sort", "color": theme.textColor, "func": () => {}}
]

export default Drawer