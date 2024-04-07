import { useState } from "react"
import { useLoaderData } from "react-router-dom"

import styled from "styled-components"
import FeatherIcon from 'feather-icons-react'

import Task from "@components/project/Task"
import TaskCreateSimple from "@components/project/Creates/TaskCreateSimple"

function Drawer({projectId, drawer, color}){
    const {tasksByDrawer} = useLoaderData()
    const tasks = tasksByDrawer.get(drawer.id)

    //Drawer collapsed handle
    const [collapsed, setCollapsed] = useState(false);
    
    const handleCollapsed = () => {
        { drawer.task_count !== 0 && setCollapsed(prev => !prev)}
    }

    //simpleCreateTask handle
    const [isSimpleOpen, setIsSimpleOpen] = useState(false)

    const handleisSimpleOpen = () => {
        setIsSimpleOpen(prev => !prev)
    }

    const drawerIcons = [
        {icon: "plus", click: () => {setsIsCreateOpen(true)}},
        {icon: "chevron-down", click: handleCollapsed},
        {icon: "more-horizontal", click: () => {}},
    ]

    return (
        <>
            <DrawerBox $color = {color}>
                <DrawerName $color = {color}>{drawer.name}</DrawerName>
                <DrawerIcon $color = {color}>
                    {drawerIcons.map(item => (
                        <FeatherIcon key={item.icon} icon={item.icon} onClick={item.click}/>
                    ))}
                </DrawerIcon>
            </DrawerBox>
            {collapsed ? null :
                <TaskList>
                    {tasks && tasks.map((task) => (
                        <Task key={task.id} projectId={projectId} task={task} color={color}/>
                    ))}
                </TaskList>
            }
            { isSimpleOpen &&
                <TaskCreateSimple/>
            }
            <TaskCreateButton onClick={handleisSimpleOpen}>
                <FeatherIcon icon="plus-circle"/>
                <TaskCreateText>할 일 추가</TaskCreateText>
            </TaskCreateButton>
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
    color: #000000;
    margin-top: 0em;
`

export default Drawer