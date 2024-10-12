import { useMemo } from "react"

import styled, { css } from "styled-components"
import FeatherIcon from "feather-icons-react"

import taskDate from "@components/tasks/utils/taskDate"

import Assigned from "@components/project/taskDetails/Assigned"
import Due from "@components/project/taskDetails/Due"
import Reminder from "@components/project/taskDetails/Reminder"
import Priority from "@components/project/taskDetails/Priority"
import Drawer from "@components/project/taskDetails/Drawer"
import Memo from "@components/project/taskDetails/Memo"

import alarmclock from "@assets/project/alarmclock.svg"
import hourglass from "@assets/project/hourglass.svg"

import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

const ContentsMobile = ({ newTask, editNewTask, activeContent, setActiveContent }) => {
    const { t } = useTranslation(null, { keyPrefix: "task" })

    const priorities = useMemo(() => makePriorities(t), [t])
    const displayReminder = useMemo(() => makeDisplayReminder(t), [t])

    const handleClickContent = (item) => {
        if (item.name === "reminder" && !newTask.due_type) {
            setActiveContent(null)
        } else {
            setActiveContent(item)
        }
    }

    const { formatted_due_datetime, formatted_assigned_date } = taskDate(newTask)

    const onClose = () => {
        setActiveContent(null)
    }

    const items = [
        {
            id: 1,
            name: "assigned",
            icon: <FeatherIcon icon="calendar" />,
            display: newTask.assigned_at ? formatted_assigned_date : t("none"),
            component: <Assigned setFunc={editNewTask} onClose={onClose}/>,
        },
        {
            id: 2,
            name: "due",
            icon: <img src={hourglass} />,
            display:
                newTask.due_type && (newTask.due_date || newTask.due_datetime)
                    ? formatted_due_datetime
                    : t("none"),
            component: <Due task={newTask} setFunc={editNewTask} />,

        },
        {
            id: 3,
            name: "reminder",
            icon: <img src={alarmclock} />,
            display:
                newTask?.reminders && newTask.reminders?.length !== 0 ? (
                    <RemindersBox>
                        {newTask.reminders.map((reminder, i) => (
                            <ReminderBlock key={i} name="reminder">
                                {displayReminder[0][reminder.delta]}
                            </ReminderBlock>
                        ))}
                    </RemindersBox>
                ) : newTask.due_type ? (
                    <EmptyReminderBox>+</EmptyReminderBox>
                ) : (
                    <EmptyReminderBox
                        onClick={() => {
                            toast.error(
                                t("reminder.reminder_before_due_date"),
                                { toastId: "reminder_before_due_date" },
                            )
                        }}>
                        -
                    </EmptyReminderBox>
                ),
            component: <Reminder task={newTask} onClose={onClose}/>,
        },
        {
            id: 4,
            name: "priority",
            icon: <FeatherIcon icon="alert-circle" />,
            display: priorities[newTask.priority],
            component: <Priority setFunc={editNewTask} onClose={onClose}/>,
        },
        {
            id: 5,
            name: "drawer",
            icon: <FeatherIcon icon="archive" />,
            display:
                newTask.project_name === "Inbox"
                    ? `${newTask.project_name}`
                    : newTask.drawer_name
                      ? `${newTask.project_name} / ${newTask.drawer_name}`
                      : t("none"),
            component: <Drawer setFunc={editNewTask} onClose={onClose}/>,
        },
        {
            id: 6,
            name: "memo",
            icon: <FeatherIcon icon="edit" />,
            display: newTask.memo ? newTask.memo : t("none"),
            component: <Memo previousMemo={newTask.memo} setFunc={editNewTask} onClose={onClose}/>,
        },
    ]

    return (
        <ContentBlock>
            {activeContent === null ? (
                items.map((item) => (
                    <ContentBox key={item.id}>
                        <ContentNameBox>
                            {item.icon}
                            {t(item.name + ".name")}
                        </ContentNameBox>
                        <ContentDisplayBox onClick={() => handleClickContent({ name: item.name, component: item.component })}>
                            {item.display}
                            <FeatherIcon icon="chevron-right"/>
                        </ContentDisplayBox>
                    </ContentBox>
                ))
            ) : (
                items.filter(item => item.name === activeContent.name).map((item) => (
                    <ContentBox key={item.id} $activeContent={activeContent}>
                        <ContentNameBox>
                            {item.icon}
                            {t(item.name + ".name")}
                        </ContentNameBox>
                        <TopContentDisplayBox>
                            {item.display}
                        </TopContentDisplayBox>
                        <CLine/>
                    </ContentBox>
                ))
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

const ContentBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-width: 0;

    ${p => p.$activeContent && css`
        flex-direction: column;
        align-items: flex-start;
        margin-left: 0.1em;
        margin-bottom: 0.6em;
        gap: 0.8em;
        min-width: 0;
    `}
`

const CLine = styled.div`
    border-top: thin solid ${(p) => p.theme.project.lineColor};
    margin: 0.3em 0em;
    width: 100%;
`

export const ContentNameBox = styled.div`
    display: flex;
    align-items: center;
    gap: 0.3em;

    & svg,
    img {
        width: 1.3em;
        height: 1.3em;
        stroke: ${(p) => p.theme.textColor};
        top: 0;
    }

    & img {
        filter: ${(p) => p.theme.project.imgColor};
        margin-right: 8px;
    }
`

const ContentDisplayBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.4em;
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
    width: 100%;
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
    padding: 0.3em;
    margin-right: 0em;
    border: solid 1.5px ${(p) => p.theme.grey};
    font-weight: 450;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`

const makePriorities = (t) => [
    t("priority.normal"),
    t("priority.important"),
    t("priority.critical"),
]

const makeDisplayReminder = (t) => [
    {
        0: t("reminder.display_then"),
        5: t("reminder.display_5_minutes_before"),
        15: t("reminder.display_15_minutes_before"),
        30: t("reminder.display_30_minutes_before"),
        60: t("reminder.display_1_hour_before"),
        1440: t("reminder.display_1_day_before"),
        2880: t("reminder.display_2_days_before"),
    },
]

export default ContentsMobile
