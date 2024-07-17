import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import styled from "styled-components"
import FeatherIcon from 'feather-icons-react'

import TaskNameInput from "@components/tasks/TaskNameInput"
import Contents from "./Contents"

import queryClient from "@queries/queryClient"
import { useMutation } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import { getTask, patchTask, deleteTask } from "@api/tasks.api"

const TaskDetail = () => {
    const [ projectID, color ] = useOutletContext()
    const { task_id } = useParams()
    const navigate = useNavigate()

    const { isPending, isError, data: task, error } = useQuery({
        queryKey: ['task', {taskID: task_id}],
        queryFn: () => getTask(task_id),
    })

    const patchMutation = useMutation({
        mutationFn: (data) => {
            return patchTask(task_id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['task', {taskID: task_id}]})
            queryClient.invalidateQueries({queryKey: ['tasks', {drawerID: task.drawer}]})
        },
    })

    const deleteMutation = useMutation({
        mutationFn: () => {
            return deleteTask(task_id)
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

    const handleDelete = () => {
        return async () => {
            navigate(`/app/projects/${projectID}`)
            deleteMutation.mutate()
        }
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
                    setFunc={patchMutation.mutate}
                    newTaskName={taskName}
                    setNewTaskName={setTaskName}
                    color={color}
                />
                <Icons>
                    <FeatherIcon icon="trash-2" onClick={handleDelete()}/>
                    <FeatherIcon icon="x" onClick={onClose} />
                </Icons>
            </TaskNameBox>
            <Contents task={task} setFunc={patchMutation.mutate}/>
        </TaskDetailBox>
    )
}

const TaskDetailBox = styled.div`
    width: 50em;
    height: 23.5em;
    background-color: ${p => p.theme.backgroundColor};
    border: solid 1px ${p => p.theme.project.borderColor};
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
        stroke: ${p => p.theme.primaryColors.danger};
        margin-left: 1em;
    }
`

export default TaskDetail