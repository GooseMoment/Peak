import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import styled from "styled-components"
import FeatherIcon from 'feather-icons-react'

import TaskNameInput from "@components/project/TaskNameInput"
import Contents from "./Contents"

import queryClient from "@queries/queryClient"
import { useMutation } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import { getTask, patchTask } from "@api/tasks.api"

const TaskDetail = () => {
    const [ projectID, color ] = useOutletContext()
    const { task_id } = useParams()
    const navigate = useNavigate()

    const { isPending, isError, data: task, error } = useQuery({
        queryKey: ['task', {taskID: task_id}],
        queryFn: () => getTask(task_id),
    })

    const mutation = useMutation({
        mutationFn: (data) => {
            return patchTask(task_id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['task', {taskID: task_id}]})
            queryClient.invalidateQueries({queryKey: ['tasks', {drawerID: task.drawer}]})
        },
    })

    const [taskName, setTaskName] = useState("")

    useEffect(() => {
        setTaskName(task?.name)
    }, [task])

    const onClose = () => {
        navigate(`/app/projects/${projectID}`)
    }

    if (isPending) {
        return <TaskDetailBox />
        // 민영아.. 스켈레톤 뭐시기 만들어..
    }

    return (
        <TaskDetailBox>
            <TaskNameBox>
                <TaskNameInput
                    task={task}
                    setFunc={mutation.mutate}
                    newTaskName={taskName}
                    setNewTaskName={setTaskName}
                    color={color}
                />
                <Icons>
                    <FeatherIcon icon="trash-2" />
                    <FeatherIcon icon="x" onClick={onClose} />
                </Icons>
            </TaskNameBox>
            <Contents task={task} setFunc={mutation.mutate}/>
        </TaskDetailBox>
    )
}

const TaskDetailBox = styled.div`
    width: 50em;
    height: 23em;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;
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

export default TaskDetail