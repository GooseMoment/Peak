import { Suspense, lazy, useState } from "react"

import styled, { useTheme } from "styled-components"

import ModalLoader from "@components/common/ModalLoader"
import Priority from "@components/tasks/Priority"
import TaskCircle from "@components/tasks/TaskCircle"
import taskCalculation from "@components/tasks/utils/taskCalculation"

import type { DemoMinimalTask, Task } from "@api/tasks.api"

import { ifMobile } from "@utils/useScreenType"

import type { PaletteColorName } from "@assets/palettes"
import AlarmClock from "@assets/project/AlarmClock"
import Hourglass from "@assets/project/Hourglass"

import FeatherIcon from "feather-icons-react"

const TaskDetailElement = lazy(
    () => import("@components/project/taskDetails/TaskDetailElement"),
)

interface TaskFrameProps {
    task: Task
    isLoading?: boolean
    toComplete?: () => void
    showTaskDetail?: boolean
    isSocial?: boolean
}

const TaskFrame = ({
    task,
    isLoading,
    toComplete,
    showTaskDetail,
    isSocial = false,
}: TaskFrameProps) => {
    const [isDetailOpen, setDetailOpen] = useState<boolean>(false)
    const theme = useTheme()
    const isCompleted = !isSocial && task.completed_at !== null

    const {
        due,
        assigned,
        calculate_due,
        calculate_assigned,
        isOutOfDue,
        isOutOfAssigned,
    } = taskCalculation(task, isSocial)

    const hasDate = task.due_type !== null || task.assigned_at !== null

    return (
        <Box>
            <Content>
                <CircleName>
                    <Icons>
                        <Priority
                            hasDate={hasDate}
                            priority={task.priority}
                            isCompleted={isCompleted}
                        />
                        <TaskCircle
                            color={task.drawer.project.color}
                            isCompleted={isCompleted}
                            hasDate={hasDate}
                            isLoading={isLoading}
                            onClick={toComplete}
                        />
                    </Icons>
                    <TaskNameBox
                        $isCompleted={isCompleted}
                        onClick={() => {
                            if (showTaskDetail) {
                                setDetailOpen(true)
                            }
                        }}>
                        {task.name}
                    </TaskNameBox>
                </CircleName>

                {hasDate && (
                    <Dates>
                        {task.assigned_at && (
                            <AssignedDate
                                $isCompleted={isCompleted}
                                $isSocial={isSocial}
                                $isOutOfAssigned={isOutOfAssigned}>
                                <FeatherIcon icon="calendar" />
                                {isCompleted ? assigned : calculate_assigned}
                            </AssignedDate>
                        )}
                        {task.due_type && (
                            <DueDate
                                $isCompleted={isCompleted}
                                $isSocial={isSocial}
                                $isOutOfDue={isOutOfDue}>
                                <Hourglass />
                                {isCompleted ? due : calculate_due}
                            </DueDate>
                        )}
                        {isSocial || task.reminders
                            ? task.reminders?.length !== 0 && (
                                  <Reminder $isCompleted={isCompleted}>
                                      <AlarmClock
                                          color={theme.project.reminderColor}
                                      />
                                      {task.reminders?.length}
                                  </Reminder>
                              )
                            : null}
                    </Dates>
                )}
            </Content>
            {isDetailOpen && (
                <Suspense
                    key="task-detail-task-frame"
                    fallback={<ModalLoader />}>
                    <TaskDetailElement
                        task={task}
                        onClose={() => setDetailOpen(false)}
                    />
                </Suspense>
            )}
        </Box>
    )
}

export const DemoTaskFrame = ({
    task,
    color,
    toComplete,
}: {
    task: DemoMinimalTask
    color: PaletteColorName
    toComplete?: () => void
}) => {
    const hasDate = task.due_type != null || task.assigned_at != null
    const isCompleted = task.completed_at != null

    const {
        due,
        assigned,
        calculate_due,
        calculate_assigned,
        isOutOfDue,
        isOutOfAssigned,
    } = taskCalculation(task, false)

    return (
        <Box>
            <Content>
                <CircleName>
                    <Icons>
                        <Priority
                            hasDate={hasDate}
                            priority={task.priority}
                            isCompleted={isCompleted}
                        />
                        <TaskCircle
                            color={color}
                            isCompleted={isCompleted}
                            hasDate={hasDate}
                            onClick={toComplete}
                        />
                    </Icons>
                    <TaskNameBox $isCompleted={isCompleted}>
                        {task?.name}
                    </TaskNameBox>
                </CircleName>
                {hasDate && (
                    <Dates>
                        {task.assigned_at && (
                            <AssignedDate
                                $isCompleted={isCompleted}
                                $isOutOfAssigned={isOutOfAssigned}>
                                <FeatherIcon icon="calendar" />
                                {isCompleted ? assigned : calculate_assigned}
                            </AssignedDate>
                        )}
                        {task.due_type && (
                            <DueDate
                                $isCompleted={isCompleted}
                                $isOutOfDue={isOutOfDue}>
                                <Hourglass />
                                {isCompleted ? due : calculate_due}
                            </DueDate>
                        )}
                    </Dates>
                )}
            </Content>
        </Box>
    )
}

const Box = styled.div`
    display: flex;
    align-items: center;
    margin-top: 0.9em;
    margin-bottom: 0.9em;
    width: 100%;

    min-width: 0;
`

const Content = styled.div`
    min-width: 0;
    width: 100%;
`

const TaskNameBox = styled.div<{ $isCompleted: boolean }>`
    display: inline-block;
    font-size: 1.1em;
    font-style: normal;
    color: ${(p) => (p.$isCompleted ? p.theme.grey : p.theme.textColor)};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 1.3em;
    width: 100%;
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
    width: 100%;
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

const AssignedDate = styled.div<{
    $isCompleted: boolean
    $isSocial?: boolean
    $isOutOfAssigned: boolean
}>`
    display: flex;
    align-items: center;
    font-style: normal;
    font-size: 0.8em;
    margin-left: 0.5em;
    color: ${(props) =>
        props.$isSocial
            ? props.theme.textColor
            : props.$isCompleted
              ? props.theme.grey
              : props.$isOutOfAssigned
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
                : props.$isCompleted
                  ? props.theme.grey
                  : props.$isOutOfAssigned
                    ? props.theme.project.danger
                    : props.theme.project.assignColor};
    }
`

const DueDate = styled.div<{
    $isCompleted: boolean
    $isSocial?: boolean
    $isOutOfDue: boolean
}>`
    display: flex;
    align-items: center;
    font-style: normal;
    font-size: 0.8em;
    margin-left: 0.5em;
    color: ${(props) =>
        props.$isSocial
            ? props.theme.textColor
            : props.$isCompleted
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
                : props.$isCompleted
                  ? props.theme.grey
                  : props.$isOutOfDue
                    ? props.theme.project.danger
                    : props.theme.project.dueColor};
    }
`

const Reminder = styled.div<{
    $isCompleted: boolean
}>`
    display: flex;
    align-items: center;
    font-style: normal;
    font-size: 0.8em;
    margin-left: 0.5em;
    color: ${(props) =>
        props.$isCompleted
            ? props.theme.grey
            : props.theme.project.reminderColor};

    & svg {
        width: 1em;
        height: 1em;
        margin-right: 0.2em;
        top: 0;
        stroke: ${(props) =>
            props.$isCompleted
                ? props.theme.grey
                : props.theme.project.reminderColor};
    }
`

export default TaskFrame
