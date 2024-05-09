import { useNavigate, useOutletContext, useLocation } from "react-router-dom"
import { useState } from "react"

import styled from "styled-components"
import FeatherIcon from 'feather-icons-react'

import TaskName from "@components/project/TaskName"
import Button from "@components/sign/Button"
import Contents from "./Contents"

import { postTask } from "@api/tasks.api"
import queryClient from "@queries/queryClient"
import notify from "@utils/notify"

const TaskCreate = () => {
    const [projectId, color] = useOutletContext()
    const {state} = useLocation()
    const navigate = useNavigate()

    const [newTaskName, setNewTaskName] = useState(null)

    const onClose = () => {
        navigate(`/app/projects/${projectId}`)
    }

    const [newTask, setNewTask] = useState({
        'name': newTaskName,
        'assigned_at': null,
        'due_date': null,
        'due_time': null,
        'reminders': [],
        'priority': 0,
        'drawer': state?.drawer_id,
        'drawer_name': state?.drawer_name,
        'project_name': state?.project_name,
        'memo': '',
        'privacy': 'public'
    })

    const editNewTask = (edit) => {
        setNewTask(Object.assign(newTask, edit))
    }

    const makeTask = async () => {
        try {
            editNewTask({'name': newTaskName})
            await postTask(newTask)
            notify.success("할 일 생성에 성공하였습니다!")
            queryClient.invalidateQueries({queryKey: ['tasks', {drawerID: state?.drawer_id}]})
            onClose()
        } catch (e) {
            console.log(e)
            notify.error("할 일 생성에 실패하였습니다.")
        }
    }

    return (
        <TaskCreateBox>
            <TaskNameBox>
                <TaskName projectId={projectId} task={newTask} setFunc={editNewTask} newTaskName={newTaskName} setNewTaskName={setNewTaskName} color={color} editable={true}/>
                <Icons>
                    <FeatherIcon icon="trash-2" />
                    <FeatherIcon icon="x" onClick={onClose} />
                </Icons>
            </TaskNameBox>
            <Contents task={newTask} setFunc={editNewTask}/>
            <AddButton onClick={makeTask}>추가하기</AddButton>
        </TaskCreateBox>
    )
}

const TaskCreateBox = styled.div`
    width: 50em;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;

    &::after {
        content: " ";
        display: block;
        height: 0;
        clear: both;
    }
`

const TaskNameBox = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1em 1.8em;
`

const Icons = styled.div`
    display: flex;
    align-items: center;

    & svg {
        top: 0.4em;
        cursor: pointer;
        stroke: #FF0000;
        margin-left: 1em;
    }
`

const AddButton = styled(Button)`
    float: right;
    margin: 1em;
    margin-right: 2.5em;
    margin-bottom: 1.5em;
`

export default TaskCreate