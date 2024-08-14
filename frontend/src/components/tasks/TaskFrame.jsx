import { Link } from "react-router-dom"

import styled, { css } from "styled-components"

import Priority from "./Priority"
import TaskCircle from "./TaskCircle"
import taskCalculation from "./utils/taskCalculation"

import alarmclock from "@assets/project/alarmclock.svg"
import hourglass from "@assets/project/hourglass.svg"

import FeatherIcon from "feather-icons-react"

const TaskFrame = ({ task, color, taskDetailPath, isLoading, toComplete }) => {
    const {
        due,
        assigned,
        calculate_due,
        calculate_assigned,
        isOutOfDue,
        isOutOfAssigned,
    } = taskCalculation(task)

    const TaskName = (
        <TaskNameBox $completed={task.completed_at}>{task?.name}</TaskNameBox>
    )

    const hasDate = task.due_date || task.assigned_at

    return (
        <Box>
            <Priority
                hasDate={hasDate}
                priority={task.priority}
                completed={task.completed_at}
            />
            <div>
                <CircleName>
                    <TaskCircle
                        completed={task.completed_at}
                        color={color}
                        hasDate={hasDate}
                        isLoading={isLoading}
                        onClick={toComplete}
                    />
                    {taskDetailPath ? (
                        <Link
                            to={taskDetailPath}
                            style={{ textDecoration: "none" }}
                        >
                            {TaskName}
                        </Link>
                    ) : (
                        TaskName
                    )}
                </CircleName>

                <Dates>
                    {task.assigned_at && (
                        <AssignedDate
                            $completed={task.completed_at}
                            $isOutOfDue={isOutOfAssigned}
                        >
                            <FeatherIcon icon="calendar" />
                            {task.completed_at ? assigned : calculate_assigned}
                        </AssignedDate>
                    )}
                    {task.due_date && (
                        <DueDate
                            $completed={task.completed_at}
                            $isOutOfDue={isOutOfDue}
                        >
                            <img src={hourglass} />
                            {task.completed_at ? due : calculate_due}
                        </DueDate>
                    )}
                    {task?.reminders
                        ? task.reminders?.length !== 0 && (
                              <Reminder $completed={task.completed_at}>
                                  <img src={alarmclock} />
                                  {task.reminders?.length}
                              </Reminder>
                          )
                        : null}
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

    width: inherit;
    font-style: normal;
    font-size: 1.1em;
    color: ${(p) => (p.$completed ? p.theme.grey : p.theme.textColor)};
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
    color: ${(props) =>
        props.$completed
            ? props.theme.grey
            : props.$isOutOfDue
              ? props.theme.project.danger
              : props.theme.project.assignColor};

    & .feather {
        top: 0;
        width: 1em;
        height: 1em;
        margin-right: 0.3em;
        color: ${(props) =>
            props.$completed
                ? props.theme.grey
                : props.$isOutOfDue
                  ? props.theme.project.danger
                  : props.theme.project.assignColor};
    }
`

const DueDate = styled.div`
    display: flex;
    align-items: center;
    font-style: normal;
    font-size: 0.8em;
    margin-left: 0.5em;
    color: ${(props) =>
        props.$completed
            ? props.theme.grey
            : props.$isOutOfDue
              ? props.theme.project.danger
              : props.theme.project.dueColor};

    & img {
        width: 1em;
        height: 1em;
        margin-right: 0.2em;

        ${(props) =>
            props.$completed
                ? css`
                      filter: ${(p) => p.theme.project.imgGreyColor};
                  `
                : props.$isOutOfDue
                  ? css`
                        filter: ${(p) => p.theme.project.imgDangerColor};
                    `
                  : css`
                        filter: ${(p) => p.theme.project.imgDueColor};
                    `};
    }
`

const Reminder = styled.div`
    display: flex;
    align-items: center;
    font-style: normal;
    font-size: 0.8em;
    margin-left: 0.5em;
    color: ${(props) =>
        props.$completed
            ? props.theme.grey
            : props.theme.project.reminderColor};

    & img {
        width: 1em;
        height: 1em;
        margin-right: 0.2em;
        top: 0;
        filter: ${(props) =>
            props.$completed
                ? css`
                      ${(p) => p.theme.project.imgGreyColor};
                  `
                : css`
                      ${(p) => p.theme.project.imgReminderColor};
                  `};
    }
`

export default TaskFrame
