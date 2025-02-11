import { useState } from "react"

import styled from "styled-components"

import TaskDetailElement from "@components/project/taskDetails/TaskDetailElement"
import Priority from "@components/tasks/Priority"
import TaskCircle from "@components/tasks/TaskCircle"
import taskCalculation from "@components/tasks/utils/taskCalculation"

import { ifMobile } from "@utils/useScreenType"

import AlarmClock from "@assets/project/AlarmClock"
import Hourglass from "@assets/project/Hourglass"

import FeatherIcon from "feather-icons-react"

const TaskFrame = ({
    task,
    color,
    showTaskDetail,
    isLoading,
    toComplete,
    isSocial,
}) => {
    const [isModalOpen, setModalOpen] = useState(false)

    const completedAt = isSocial ? null : task.completed_at

    const {
        due,
        assigned,
        calculate_due,
        calculate_assigned,
        isOutOfDue,
        isOutOfAssigned,
    } = taskCalculation(task, isSocial)

    const TaskName = (
        <TaskNameBox
            $completed={completedAt}
            onClick={() => {
                showTaskDetail && setModalOpen(true)
            }}>
            {task?.name}
        </TaskNameBox>
    )

    const hasDate = task.due_type || task.assigned_at

    return (
        <Box>
            <Content>
                <CircleName>
                    <Icons>
                        <Priority
                            hasDate={hasDate}
                            priority={task.priority}
                            completed={task.completed_at}
                        />
                        <TaskCircle
                            completed={task.completed_at}
                            color={color}
                            hasDate={hasDate}
                            isLoading={isLoading}
                            onClick={toComplete}
                        />
                    </Icons>
                    {TaskName}
                </CircleName>

                {hasDate && (
                    <Dates>
                        {task.assigned_at && (
                            <AssignedDate
                                $completed={task.completed_at}
                                $isSocial={isSocial}
                                $isOutOfDue={isOutOfAssigned}>
                                <FeatherIcon
                                    draggable="false"
                                    icon="calendar"
                                />
                                {completedAt ? assigned : calculate_assigned}
                            </AssignedDate>
                        )}
                        {task.due_type && (
                            <DueDate
                                $completed={task.completed_at}
                                $isSocial={isSocial}
                                $isOutOfDue={isOutOfDue}>
                                <Hourglass />
                                {completedAt ? due : calculate_due}
                            </DueDate>
                        )}
                        {isSocial || task.reminders
                            ? task.reminders?.length !== 0 && (
                                  <Reminder $completed={task.completed_at}>
                                      <AlarmClock />
                                      {task.reminders?.length}
                                  </Reminder>
                              )
                            : null}
                    </Dates>
                )}
            </Content>
            {isModalOpen ? (
                <TaskDetailElement
                    onClose={() => setModalOpen(false)}
                    projectType={task.projectType}
                    color={color}
                    task={task}
                />
            ) : null}
        </Box>
    )
}

const Box = styled.div`
    display: flex;
    align-items: center;
    margin-top: 0.9em;
    margin-bottom: 0.9em;

    min-width: 0;
`

const Content = styled.div`
    min-width: 0;
`

const TaskNameBox = styled.div`
    display: inline-block;
    font-size: 1.1em;
    font-style: normal;
    color: ${(p) => (p.$completed ? p.theme.grey : p.theme.textColor)};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 1.3em;
    min-width: 0;

    ${ifMobile} {
        white-space: normal;
        word-wrap: normal;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
`

const CircleName = styled.div`
    display: flex;
`

const Icons = styled.div`
    display: flex;
    align-items: center;
`

const Dates = styled.div`
    display: flex;
    align-items: center;
    margin-top: 0.4em;
    margin-left: 3em;
`

const AssignedDate = styled.div`
    display: flex;
    align-items: center;
    font-style: normal;
    font-size: 0.8em;
    margin-left: 0.5em;
    color: ${(props) =>
        props.$isSocial
            ? props.theme.textColor
            : props.$completed
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
            props.$isSocial
                ? props.theme.textColor
                : props.$completed
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
        props.$isSocial
            ? props.theme.textColor
            : props.$completed
              ? props.theme.grey
              : props.$isOutOfDue
                ? props.theme.project.danger
                : props.theme.project.dueColor};

    & svg {
        width: 1em;
        height: 1em;
        margin-right: 0.2em;
        stroke: ${(props) =>
            props.$isSocial
                ? props.theme.textColor
                : props.$completed
                  ? props.theme.grey
                  : props.$isOutOfDue
                    ? props.theme.project.danger
                    : props.theme.project.dueColor};
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

    & svg {
        width: 1em;
        height: 1em;
        margin-right: 0.2em;
        top: 0;
        stroke: ${(props) =>
            props.$completed
                ? props.theme.grey
                : props.theme.project.reminderColor};
    }
`

export default TaskFrame
