import { Dispatch, SetStateAction, useMemo } from "react"

import styled, { css } from "styled-components"

import TaskDetailAssigned from "@components/project/taskDetails/TaskDetailAssigned"
import TaskDetailCompleted from "@components/project/taskDetails/TaskDetailCompleted"
import TaskDetailDrawer from "@components/project/taskDetails/TaskDetailDrawer"
import TaskDetailDue from "@components/project/taskDetails/TaskDetailDue"
import TaskDetailMemo from "@components/project/taskDetails/TaskDetailMemo"
import TaskDetailPriority from "@components/project/taskDetails/TaskDetailPriority"
import TaskDetailReminder from "@components/project/taskDetails/TaskDetailReminder"
import type { TaskContent } from "@components/tasks/contents"
import useTaskDateDisplay from "@components/tasks/utils/useTaskDateDisplay"

import type { MinimalTask } from "@api/tasks.api"

import AlarmClock from "@assets/project/AlarmClock"
import Hourglass from "@assets/project/Hourglass"

import FeatherIcon from "feather-icons-react"
import { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const ContentsMobile = ({
    task,
    setFunc,
    activeContent,
    setActiveContent,
}: {
    task: MinimalTask
    setFunc: (diff: Partial<MinimalTask>) => void
    activeContent: TaskContent | null
    setActiveContent: Dispatch<SetStateAction<TaskContent | null>>
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task" })

    const priorities = useMemo(() => makePriorities(t), [t])
    const displayReminder = useMemo(() => makeDisplayReminder(t), [t])

    const handleClickContent = (name: string) => {
        if (name === "reminder" && !task.due_type) {
            setActiveContent(null)
        } else {
            setActiveContent(name as TaskContent | null)
        }
    }

    const {
        formatted_due_datetime,
        formatted_assigned_date,
        formatted_completed_date,
    } = useTaskDateDisplay(task)

    const onClose = () => {
        setActiveContent(null)
    }

    const items = [
        ...(task.completed_at
            ? [
                  {
                      id: 0,
                      name: "completed" as const,
                      icon: <FeatherIcon icon="check-circle" />,
                      display: formatted_completed_date,
                      component: <TaskDetailCompleted setFunc={setFunc} />,
                  },
              ]
            : []),
        {
            id: 1,
            name: "assigned" as const,
            icon: <FeatherIcon icon="calendar" />,
            display: task.assigned_at ? formatted_assigned_date : t("none"),
            component: (
                <TaskDetailAssigned
                    assignedAt={task.assigned_at}
                    setFunc={setFunc}
                />
            ),
        },
        {
            id: 2,
            name: "due" as const,
            icon: <Hourglass />,
            display:
                task.due_type && (task.due_date || task.due_datetime)
                    ? formatted_due_datetime
                    : t("none"),
            component: <TaskDetailDue task={task} setFunc={setFunc} />,
        },
        {
            id: 3,
            name: "reminder" as const,
            icon: <AlarmClock />,
            display:
                task?.reminders && task.reminders?.length !== 0 ? (
                    <RemindersBox data-name="reminder">
                        {task.reminders.map((reminder, i) => (
                            <ReminderBlock key={i} data-name="reminder">
                                {displayReminder[reminder.delta]}
                            </ReminderBlock>
                        ))}
                    </RemindersBox>
                ) : task.due_type ? (
                    <EmptyReminderBox data-name="reminder">+</EmptyReminderBox>
                ) : (
                    <EmptyReminderBox
                        data-name="none"
                        onClick={() => {
                            toast.error(
                                t("reminder.reminder_before_due_date"),
                                { toastId: "reminder_before_due_date" },
                            )
                        }}>
                        -
                    </EmptyReminderBox>
                ),
            component: <TaskDetailReminder task={task} setFunc={setFunc} />,
        },
        {
            id: 4,
            name: "priority" as const,
            icon: <FeatherIcon icon="alert-circle" />,
            display: priorities[task.priority],
            component: (
                <TaskDetailPriority setFunc={setFunc} onClose={onClose} />
            ),
        },
        {
            id: 5,
            name: "drawer" as const,
            icon: <FeatherIcon icon="archive" />,
            display:
                task.drawer.project.type === "inbox"
                    ? `${task.drawer.project.name}`
                    : task.drawer.name
                      ? `${task.drawer.project.name} / ${task.drawer.name}`
                      : t("none"),
            component: <TaskDetailDrawer setFunc={setFunc} onClose={onClose} />,
        },
        {
            id: 6,
            name: "memo" as const,
            icon: <FeatherIcon icon="edit" />,
            display: task.memo ? task.memo : t("none"),
            component: (
                <TaskDetailMemo
                    previousMemo={task.memo}
                    setFunc={setFunc}
                    onClose={onClose}
                />
            ),
        },
    ]

    return (
        <ContentBlock>
            {activeContent === null
                ? items.map((item) => (
                      <ContentBox key={item.id}>
                          <ContentNameBox>
                              {item.icon}
                              {t(`${item.name}.name`)}
                          </ContentNameBox>
                          <ContentDisplayBox
                              onClick={() => handleClickContent(item.name)}>
                              {item.display}
                              <FeatherIcon icon="chevron-right" />
                          </ContentDisplayBox>
                      </ContentBox>
                  ))
                : items.map(
                      (item) =>
                          item.name === activeContent && (
                              <ContentBox
                                  key={item.id}
                                  $activeContent={item.name === activeContent}>
                                  <ContentNameBox>
                                      {item.icon}
                                      {t(`${item.name}.name`)}
                                  </ContentNameBox>
                                  <TopContentDisplayBox>
                                      {item.display}
                                  </TopContentDisplayBox>
                                  <CLine />
                                  {item.component}
                              </ContentBox>
                          ),
                  )}
        </ContentBlock>
    )
}

const ContentBlock = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1.8em;
    margin-top: 2em;
    min-width: 0;
`

const ContentBox = styled.div<{ $activeContent?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-width: 0;

    ${(p) =>
        p.$activeContent &&
        css`
            flex-direction: column;
            align-items: flex-start;
            margin-left: 0.1em;
            margin-bottom: 0.6em;
            gap: 0.5em;
            min-width: 0;
        `}
`

const CLine = styled.div`
    border-top: thin solid ${(p) => p.theme.project.lineColor};
    margin-top: 0.3em;
    width: 100%;
`

export const ContentNameBox = styled.div`
    display: flex;
    align-items: center;
    color: ${(p) => p.theme.textColor};
    gap: 0.3em;

    & svg {
        width: 1.3em;
        height: 1.3em;
        margin-right: 8px;
        stroke: ${(p) => p.theme.textColor};
        top: 0;
    }
`

const ContentDisplayBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.4em;
    color: ${(p) => p.theme.textColor};
    max-width: 70%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 1.3em;
    min-width: 0;

    & svg {
        top: 0;
        margin-right: 0;
    }
`

const TopContentDisplayBox = styled(ContentDisplayBox)`
    justify-content: flex-start;
    max-width: 100%;
    overflow: auto;
`

const RemindersBox = styled.div`
    display: flex;
    gap: 0.5em;
`

const ReminderBlock = styled.div`
    width: auto;
    font-size: 0.9em;
    padding: 0.3em;
    border: solid 1.5px ${(p) => p.theme.grey};
    font-weight: 450;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`

const EmptyReminderBox = styled.div`
    font-size: 0.9em;
    width: 1em;
    height: 1em;
    padding: 0.3em;
    margin-right: 0em;
    border: solid 1.5px ${(p) => p.theme.grey};
    font-weight: 450;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`

const makePriorities = (t: TFunction<"translation", "task">) => [
    t("priority.normal"),
    t("priority.important"),
    t("priority.critical"),
]

const makeDisplayReminder = (
    t: TFunction<"translation", "task">,
): Record<number, string> => ({
    0: t("reminder.display_then"),
    5: t("reminder.display_5_minutes_before"),
    15: t("reminder.display_15_minutes_before"),
    30: t("reminder.display_30_minutes_before"),
    60: t("reminder.display_1_hour_before"),
    1440: t("reminder.display_1_day_before"),
    2880: t("reminder.display_2_days_before"),
})

export default ContentsMobile
