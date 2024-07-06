import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import TaskCircle from "./TaskCircle"
import Priority from "./Priority"

import taskCalculation from "./utils/taskCalculation"

import hourglass from "@assets/project/hourglass.svg"
import alarmclock from "@assets/project/alarmclock.svg"

import styled, { css } from "styled-components"
import FeatherIcon from "feather-icons-react"

const TaskFrame = ({task, setFunc, color, taskDetailPath}) => {
    const [isLoading, setIsLoading] = useState(false)
    const {assigned, due} = taskCalculation(task)

    const TaskName = <TaskNameBox $completed={task.completed_at}>
        {task?.name}
    </TaskNameBox>

    const toComplete = () => {
        setIsLoading(true)
        let completed_at = null
        if (!(task.completed_at)) {
            completed_at = new Date().toISOString()
        }
        setFunc({completed_at})
    }

    useEffect(() => {
        setIsLoading(false)
    }, [task])

    const hasDate = task.due_date || task.assigned_at

    return (
        <Box>
            <Priority hasDate={hasDate} priority={task.priority} completed={task.completed_at} />
            <div>
                <CircleName>
                    <TaskCircle
                        completed={task.completed_at}
                        color={color}
                        hasDate={hasDate}
                        isLoading={isLoading}
                        onClick={toComplete}
                    />
                    {taskDetailPath ? <Link to={taskDetailPath} style={{ textDecoration: 'none' }}> 
                        {TaskName}
                    </Link> : TaskName}
                </CircleName>

                <Dates>
                    {task.assigned_at &&
                    <AssignedDate $completed={task.completed_at} $isOutOfDue={assigned === "놓침"}>
                        <FeatherIcon icon="calendar" />
                        {assigned}
                    </AssignedDate>
                    }
                    {task.due_date && 
                    <DueDate $completed={task.completed_at} $isOutOfDue={due === "기한 지남"}>
                        <img src={hourglass} />
                        {due}
                    </DueDate>}
                    {task.reminders?.length !== 0 &&
                    <Reminder $completed={task.completed_at}>
                        <img src={alarmclock} />
                        {task.reminders?.length}
                    </Reminder>
                    }
                </Dates>
            </div>
        </Box>
    )
}

const Box = styled.div`
    display: flex;
    align-items: center;
    margin-top: 1.5em;
`

const TaskNameBox = styled.div`
    display: inline-block;

    width: 60em;
    font-style: normal;
    font-size: 1.1em;
    color: ${p => p.$completed ? p.theme.grey : p.theme.textColor};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3em;
`

const CircleName = styled.div`
    display: flex;
`

const Dates = styled.div`
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

const Reminder = styled.div`
    display: flex;
    align-items: center;
    font-style: normal;
    font-size: 0.8em;
    margin-left: 0.5em;
    color: ${(props) => (props.$completed ? '#A4A4A4' : '#7e47d1')};
    
    & img {
        width: 1em;
        height: 1em;
        margin-right: 0.2em;
        filter: ${(props) => (props.$completed ? css`
        invert(83%) sepia(0%) saturate(1370%) hue-rotate(314deg) brightness(81%) contrast(81%);
        ` : css`
        invert(31%) sepia(68%) saturate(1747%) hue-rotate(244deg) brightness(87%) contrast(89%);
        `)};
    }
`

export default TaskFrame
