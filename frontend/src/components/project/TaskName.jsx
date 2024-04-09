import { useSubmit } from "react-router-dom"
import { useState, useEffect } from "react"

import styled from "styled-components"

import TaskFrame from "./TaskFrame"
import TaskNameInput from "./TaskNameInput"

function TaskName({projectId, task, color, editable}){
    const date = new Date()
    const submit = useSubmit()
    const pathRoot = `/app/projects/${projectId}/tasks/${task.id}/detail`

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(false)
    }, [task]);

    const toComplete = () => {
        setIsLoading(true)
        let completed_at = "null"
        if (!(task.completed_at)) {
            completed_at = date.toISOString()
        }
        submit({id: task.id, completed_at}, {
            method: "PATCH",
            action: `/app/projects/${projectId}`,
            navigate: false,
        })
    }

    return (
        <>
            <TaskNameBox>
                { editable ?
                    <TaskNameInput 
                        taskName={task.name}
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