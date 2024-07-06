import { Fragment, useState } from "react"
import { useNavigate } from "react-router-dom"

import styled, { css } from "styled-components"
import { cubicBeizer } from "@assets/keyframes"
import { rotateToUp, rotateToUnder } from "@assets/keyframes"
import FeatherIcon from 'feather-icons-react'

import Task from "@components/project/Task"

import { useInfiniteQuery } from "@tanstack/react-query"
import { getTasksByDrawer } from "@api/tasks.api"
import Button from "@components/common/Button"
import { useTranslation } from "react-i18next"

const getPageFromURL = (url) => {
    if (!url) return null
    
    const u = new URL(url)
    const page = u.searchParams.get("page")
    return page
}

const Drawer = ({project, drawer, color}) => {
    const navigate = useNavigate()

    const { t } = useTranslation(null, {keyPrefix: "project"})

    const { data, isError, fetchNextPage, isLoading } = useInfiniteQuery({
        queryKey: ["tasks", {drawerID: drawer.id}],
        queryFn: (pages) => getTasksByDrawer(drawer.id, pages.pageParam || 1),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    // useInfiniteQuery에서 제공하는 hasNextPage가 제대로 작동 안함. 어째서?
    const hasNextPage = data?.pages[data?.pages?.length-1].next !== null

    //Drawer collapsed handle
    const [collapsed, setCollapsed] = useState(false);
    
    const handleCollapsed = () => {
        {drawer.task_count !== 0 && setCollapsed(prev => !prev)}
    }

    //simpleCreateTask handle
    const [isSimpleOpen, setIsSimpleOpen] = useState(false)

    const handleisSimpleOpen = () => {
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
        {icon: <FeatherIcon icon={"more-horizontal"}/>},
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
            <DrawerBox $color = {color}>
                <DrawerName $color = {color}>{drawer.name}</DrawerName>
                <DrawerIcon $color = {color}>
                    {drawerIcons.map((item, i) => (
                        <Fragment key={i}>{item.icon}</Fragment>
                    ))}
                </DrawerIcon>
            </DrawerBox>
            {collapsed ? null :
                <TaskList>
                    {data?.pages?.map((group) => (
                        group?.results?.map((task) =>
                            <Task key={task.id} projectId={project.id} task={task} color={color}/>
                    )))}
                </TaskList>
            }
            {/*isSimpleOpen &&
                <TaskCreateSimple 
                    color={color}
                    drawer_id={drawer.id}
                    drawer_name={drawer.name}
                    project_name={project.name}
                />
            */}
            <TaskCreateButton onClick={handleisSimpleOpen}>
                <FeatherIcon icon="plus-circle"/>
                <TaskCreateText>{t("button_add_task")}</TaskCreateText>
            </TaskCreateButton>
            <FlexBox>
                {hasNextPage ? <MoreButton onClick={() => fetchNextPage()}>{t("button_load_more")}</MoreButton> : null}
            </FlexBox>
        </>
    );
}

const DrawerBox = styled.div`
    height: 3em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.5em;
    text-decoration: double;
    border: solid 0.25em #${props => props.$color};
    border-radius: 15px;
`

const DrawerName = styled.h1`
    width: 42em;
    font-size: 1.4em;
    font-weight: bold;
    text-align: left;
    margin-left: 1.45em;
    color: #${props => props.$color};
    stroke-opacity: 0.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const DrawerIcon = styled.div`
    display: flex;
    align-items: center;
    margin-right: 1.45em;

    & svg {
        top: 0;
        margin-right: 1em;
        color: #${props => props.$color};
        cursor: pointer;
    }
`

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

const TaskList = styled.div`
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

export default Drawer