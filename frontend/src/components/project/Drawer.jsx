import { useState, useEffect } from "react";

import styled from "styled-components";
import FeatherIcon from 'feather-icons-react';

import { getTasksByDrawer } from "@api/tasks.api"
import Task from "@components/project/Task"

function Drawer({id, drawer, color}){
    const [collapsed, setCollapsed] = useState(false);
    const [tasks, setTasks] = useState([])
    
    const handleCollapsed = () => {
        { drawer.task_count !== 0 && setCollapsed(prev => !prev)}
    }

    const DrawerIcons = [
        {icon: "plus", click: () => setIsModalOpen(true)},
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
                        drawer.id === task.drawer && <Task key={task.id} task={task} setTasks={setTasks} color={color}/>
                    ))}
                </TaskList>
            }
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

export default Drawer