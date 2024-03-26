import { useEffect, useState } from "react"
import { useLoaderData, useParams } from "react-router-dom"

import Task from "@components/project/Task"
import Drawer from "@components/project/Drawer"
import TaskCreateSimple from "@components/project/TaskCreate/TaskCreateSimple"
import { getTasksByDrawer } from "@api/tasks.api"

import styled from "styled-components";
import FeatherIcon from "feather-icons-react";

const ProjectPage = () => {
    const { id } = useParams()
    const [project, drawers] = useLoaderData()
    const [tasks, setTasks] = useState([])

    async function fetchTasks() {
        try {
            const res = await getTasksByDrawer(drawers.id)
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
        <TitleBox>
            <TitleName>{project.name}</TitleName>
            <FeatherIcon icon="more-horizontal"/>
        </TitleBox>
        {drawers && drawers.map((drawer) => (
            <>
                <Drawer key={drawer.id} drawer={drawer}>
                    <TaskList>
                        {tasks && tasks.map((task) => (
                            drawer.name === task.drawer_name && <Task key={task.id} task={task}/>
                        ))}
                    </TaskList>
                </Drawer>
            </>
        ))}
        <TaskCreateSimple />
        <TaskCreateButton>
            <FeatherIcon icon="plus-circle"/>
            <TaskCreateText>할 일 추가</TaskCreateText>
        </TaskCreateButton>
    </>
    )
}

const TitleBox = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const TitleName = styled.h1`
    font-size: 2em;
    font-weight: bolder;
    text-align: left;
    color: #0031E0;
`

const TaskList = styled.div`
    flex: 1;
    padding: 12px;
    overflow-y: auto;
`

const TaskCreateButton = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    vertical-align: center;
    text-align: middle;
    margin-left: 0.8em;
    margin-top: 1.5em;

    & svg {
        text-align: center;
        width: 1.3em;
        height: 1.3em;
        top: 0;
    } 
`

const TaskCreateText = styled.div`
    text-align: center;
    font-size: 1.1em;
    font-weight: medium;
    color: #000000;
    margin-top: 0em;
`

const mockProjects = [
    {name: "Inbox", color: "#6E6E6E", type: "regular", privacy: "public", to: "/projects/inbox"},
    {name: "홍대라이프", color: "#2E61DC", type: "regular", privacy: "public", to: "/projects/홍대라이프"},
    {name: "홍대기숙사총장일", color: "#DC2E2E", type: "regular", privacy: "followers", to: "/projects/홍대기숙사총장일"},
    {name: "장충동왕족발보쌈", color: "#D92EDC", type: "regular", privacy: "me", to: "/projects/장충동왕족발보쌈"},
]

export default ProjectPage