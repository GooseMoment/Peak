import { useState, useEffect } from "react";

import styled from "styled-components";
import FeatherIcon from 'feather-icons-react';

import { getTasksByDrawer } from "@api/tasks.api"
import Task from "@components/project/Task"
import TaskCreateSimple from "@components/project/Creates/TaskCreateSimple";
import DrawerCreate from "@components/project/Creates/DrawerCreate";
import ModalPortal from "@components/common/ModalPortal";

function Drawer({id, drawer, color}){
    const [tasks, setTasks] = useState([])

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

    //Create
    const [isCreateOpen, setsIsCreateOpen] = useState(false)

    const DrawerIcons = [
        {icon: "plus", click: () => setsIsCreateOpen(true)},
        {icon: "more-horizontal", click: () => {}},
        {icon: "chevron-down", click: handleCollapsed},
    ]

    async function fetchTasks() {
        try {
            let res = await getTasksByDrawer(drawer.id)
            setTasks(res)
        } catch (e) {
            throw alert(e)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [id])

    return (
        <>
            <DrawerBox $color = {color}>
                <DrawerName>{drawer.name}</DrawerName>
                <DrawerIcon>
                    {DrawerIcons.map(item => (
                        <FeatherIcon key={item.icon} icon={item.icon} onClick={item.click}/>
                    ))}
                </DrawerIcon>
            </DrawerBox>
            {collapsed ? null :
                <TaskList>
                    {tasks && tasks.map((task) => (
                        drawer.id === task.drawer && <Task key={task.id} id={id} task={task} setTasks={setTasks} color={color}/>
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
            { isCreateOpen &&
            <ModalPortal closeModal={() => {setsIsCreateOpen(false)}}>
                <DrawerCreate onClose={() => {setsIsCreateOpen(false)}}/>
            </ModalPortal>}
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
    background-color: #${props => props.$color};
    border-radius: 17px 17px 0px 0px;
`

const DrawerName = styled.h1`
    font-size: 1.4em;
    font-weight: bold;
    text-align: left;
    margin-left: 1.45em;
    color: #FFFFFF;
    stroke: #000000;
    stroke-opacity: 0.2;
`

const DrawerIcon = styled.div`
    display: flex;
    align-items: center;
    margin-right: 1.45em;

    & svg {
        top: 0;
        margin-right: 1em;
        cursor: pointer;
    }
`

const TaskList = styled.div`
    flex: 1;
    margin-left: 1.1em;
`

const TaskCreateButton = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    margin-left: 1.3em;
    margin-top: 1.3em;
    
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
    font-size: 1em;
    font-weight: medium;
    color: #000000;
    margin-top: 0em;
`

export default Drawer