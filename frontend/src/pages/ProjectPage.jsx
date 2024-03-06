import Task from "@components/project/Task"
import Drawer from "@components/project/Drawer";
import TaskCreateSimple from "@components/project/TaskCreate/TaskCreateSimple";

import styled from "styled-components";
import FeatherIcon from "feather-icons-react";

const ProjectPage = () => {
    return (
    <>
        <TitleBox>
            <TitleName>홍대라이프</TitleName>
            <FeatherIcon icon="more-horizontal"/>
        </TitleBox>
        {mockDrawers.map((drawer) => (
            <>
                <Drawer key={drawer.id} drawer={drawer}>
                    <TaskList>
                        {mockTasks.map((task) => (
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

const mockDrawers = [
    {id: 0, name: "수강신청", project:"홍대라이프", color: "#2E61DC", uncompleted_task_count: 1, completed_task_count: 1},
    {id: 1, name: "고스락", project:"홍대라이프", color: "#2E61DC", uncompleted_task_count: 0, completed_task_count: 0},
]

const mockTasks = [
    {id: 0, name: "수강신청", drawer_name: "수강신청", privacy: "public", completed: false, due_date: "01월 30일", priority: 2},
    {id: 1, name: "담아두기", drawer_name: "수강신청", privacy: "public", completed: true, due_date: "02월 20일", priority: 0},
]

export default ProjectPage