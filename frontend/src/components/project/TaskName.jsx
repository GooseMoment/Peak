import { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"

import styled from "styled-components"

import TaskFrame from "./TaskFrame"
import TaskNameInput from "./TaskNameInput"

const TaskName = ({projectId, task, setFunc, newTaskName, setNewTaskName, color, editable}) => {
    const date = new Date()
    const pathRoot = `/app/projects/${projectId}/tasks/${task.id}/detail`

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(false)
    }, [task]);

    const changeTaskName = async (name) => {
        setFunc({name})
    }

    const mutation = useMutation({
        mutationFn: (data) => {
            return patchTask(task.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['task', {taskID: task_id}]})
            queryClient.invalidateQueries({queryKey: ['tasks', {drawerID: task.drawer}]})
        },
    })

    const toComplete = () => {
        setIsLoading(true)
        let completed_at = null
        if (!(task.completed_at)) {
            completed_at = date.toISOString()
        }
        mutation.mutate({completed_at})
    }

    return (
        <>
            <TaskNameBox>
                { editable ?
                    <TaskNameInput 
                        newTaskName={newTaskName}
                        setNewTaskName={setNewTaskName}
                        changeTaskName={changeTaskName}
                        completed={task.completed_at ? true : false}
                        color={color}
                        isDate={task.due_date || task.assigned_at ? true : false}
                        editable={editable}
                        isLoading={isLoading}
                        toComplete={toComplete}
                    /> :
                    <TaskFrame
                        taskName={task.name}
                        pathRoot={pathRoot}
                        completed={task.completed_at ? true : false}
                        color={color}
                        isDate={task.due_date || task.assigned_at ? true : false}
                        editable={editable}
                        isLoading={isLoading}
                        toComplete={toComplete}
                    />
                }
            </TaskNameBox>
        </>
    );
}

const TaskNameBox = styled.div`
    display: flex;
    align-items: center;
    padding-top: 0.8em;

    &:hover {
        cursor: pointer;
    }
`

export default TaskName