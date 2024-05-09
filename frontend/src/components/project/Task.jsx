import { useState } from "react"

import styled, { css } from "styled-components"
import FeatherIcon from "feather-icons-react"

import { useMutation } from "@tanstack/react-query"
import queryClient from "@queries/queryClient"

import { patchTask } from "@api/tasks.api"
import taskDate from "./taskDate"
import TaskName from "./TaskName"
import Priority from "./Priority"

import hourglass from "@assets/project/hourglass.svg"

const Task = ({projectId, task, color}) => {
    const [newTaskName, setNewTaskName] = useState(task.name)
    const {assigned, due} = taskDate(task)

    const mutation = useMutation({
        mutationFn: (data) => {
            return patchTask(task.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['task', {taskID: task.id}]})
            queryClient.invalidateQueries({queryKey: ['tasks', {drawerID: task.drawer}]})
        },
    })

    return (
        <Box>
            <Priority priority={task.priority} completed={task.completed_at ? true : false}/>
            <div>
                <TaskName
                    projectId={projectId}
                    task={task}
                    setFunc={mutation.mutate}
                    newTaskName={newTaskName}
                    setNewTaskName={setNewTaskName}
                    color={color} 
                    editable={false}
                />
                <FlexBox>
                    {task.assigned_at &&
                    <AssignedDate $completed={task.completed_at ? true : false} $isOutOfDue={assigned === "놓침"}>
                        <FeatherIcon icon="calendar" />
                        {assigned}
                    </AssignedDate>
                    }
                    {task.due_date && 
                    <DueDate $completed={task.completed_at ? true : false} $isOutOfDue={due === "기한 지남"}>
                        <img src={hourglass} />
                        {due}
                    </DueDate>}
                </FlexBox>
            </div>
        </Box>
    )
}

const Box = styled.div`
    display: flex;
    align-items: center;
    margin-top: 1em;
`

const FlexBox = styled.div`
    display: flex;
    align-items: center;
    margin-top: 0.2em;
    margin-left: 1.8em;
`

const AssignedDate = styled.div`
    display: flex;
    align-items: center;
    font-style: normal;
    font-size: 0.8em;
    margin-left: 0.5em;
    color: ${(props) => (props.$completed ? '#A4A4A4' : props.$isOutOfDue ? '#FF0000' : '#2E61DC')};

    & .feather {
        top: 0;
        width: 1em;
        height: 1em;
        margin-right: 0.3em;
        color: ${(props) => (props.$completed ? '#A4A4A4' : props.$isOutOfDue ? '#FF0000' : '#2E61DC')};
    }
`

const DueDate = styled.div`
    display: flex;
    align-items: center;
    font-style: normal;
    font-size: 0.8em;
    margin-left: 0.5em;
    color: ${(props) => (props.$completed ? '#A4A4A4' : props.$isOutOfDue ? '#FF0000' : '#009773')};

    & img {
        width: 1em;
        height: 1em;
        margin-right: 0.2em;
        filter: ${(props) => (props.$completed ? css`
        invert(83%) sepia(0%) saturate(1370%) hue-rotate(314deg) brightness(81%) contrast(81%);
        ` : props.$isOutOfDue ? css`
        invert(10%) sepia(97%) saturate(6299%) hue-rotate(3deg) brightness(101%) contrast(113%);
        ` : css`
        invert(39%) sepia(48%) saturate(3439%) hue-rotate(143deg) brightness(89%) contrast(101%);
        `)};
    }
`

export default Task