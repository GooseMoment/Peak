import styled, { css } from "styled-components"
import FeatherIcon from "feather-icons-react"

import { DateTime } from "luxon"

import TaskName from "./TaskName"
import Priority from "./Priority"

import hourglass from "@assets/project/hourglass.svg"

function Task({projectId, task, color}){
    const today = new Date()
    const task_due_time = new Date(`${task.due_date}${task.due_time ? "T"+task.due_time : ""}`)
    const assigned_at_date = new Date(task.assigned_at)
    const new_due_date = `${task_due_time.getMonth()+1}월 ${task_due_time.getDate()}일`
    const new_assigned_at_date = `${assigned_at_date.getMonth()+1}월 ${assigned_at_date.getDate()}일`
    
    const dtoday = DateTime.fromJSDate(today)
    const ddue = DateTime.fromJSDate(task_due_time)

    const ddays = ddue.diff(dtoday, ["years", "months", "days"]).toObject()

    let dday = ''
    if (ddays.years < 0 || ddays.months < 0 || ddays.days < 0) {
        dday = '기한 지남'
    }
    else if (ddays.days > 0) {
        dday = `${Math.floor(ddays.days)}일 남음`
    }
    else {
        dday = new_due_date
    }

    return (
        <Box>
            <Priority priority={task.priority} completed={task.completed_at ? true : false}/>
            <div>
                <TaskName projectId={projectId} task={task} color={color} editable={false}/>
                <FlexBox>
                    {task.assigned_at &&
                    <AssignedDate $completed={task.completed_at ? true : false}>
                        <FeatherIcon icon="calendar" />
                        {new_assigned_at_date}
                    </AssignedDate>
                    }
                    {task.due_date && 
                    <DueDate $completed={task.completed_at ? true : false}>
                        <img src={hourglass} />
                        {dday}
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
    color: ${(props) => (props.$completed ? '#A4A4A4' : '#2E61DC')};

    & .feather {
        top: 0;
        width: 1em;
        height: 1em;
        margin-right: 0.3em;
        color: ${(props) => (props.$completed ? '#A4A4A4' : '#2E61DC')};
    }
`

const DueDate = styled.div`
    display: flex;
    align-items: center;
    font-style: normal;
    font-size: 0.8em;
    margin-left: 0.5em;
    color: ${(props) => (props.$completed ? '#A4A4A4' : '#009773')};

    & img {
        width: 1em;
        height: 1em;
        margin-right: 0.2em;
        filter: ${(props) => (props.$completed ? css`
        invert(83%) sepia(0%) saturate(1370%) hue-rotate(314deg) brightness(81%) contrast(81%);
        ` : css`
        invert(39%) sepia(48%) saturate(3439%) hue-rotate(143deg) brightness(89%) contrast(101%);
        `)};
    }
`

export default Task