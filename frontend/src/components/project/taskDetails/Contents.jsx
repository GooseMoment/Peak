import { Fragment, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import styled, { css } from "styled-components"

import ModalWindow from "@components/common/ModalWindow"
import ToolTip from "@components/project/common/ToolTip"
import taskDate from "@components/tasks/utils/taskDate"

import Assigned from "./Assigned"
import Drawer from "./Drawer"
import Due from "./Due"
import Memo from "./Memo"
import Priority from "./Priority"
import Reminder from "./Reminder"

import alarmclock from "@assets/project/alarmclock.svg"
import hourglass from "@assets/project/hourglass.svg"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const Contents = ({ task, setFunc }) => {
    const { t } = useTranslation(null, { keyPrefix: "task" })
    const navigate = useNavigate()

    const [isComponentOpen, setIsComponentOpen] = useState(false)

    const priorities = useMemo(() => makePriorities(t), [t])
    const displayReminder = useMemo(() => makeDisplayReminder(t), [t])

    // text클릭 시 알맞는 component 띄우기
    const [content, setContent] = useState(null)

    const handleClickContent = (e) => {
        const { name } = e.target.attributes
        setContent(name.value)
        setIsComponentOpen(true)
    }

    const closeComponent = () => {
        setIsComponentOpen(false)
        navigate(`.`)
    }

    const { formatted_due_datetime, formatted_assigned_date } = taskDate(task)

    const items = [
        {
            id: 1,
            name: "assigned_due",
            icon: <FeatherIcon icon="calendar" />,
            display: task.assigned_at ? formatted_assigned_date : t("none"),
            component: <Assigned setFunc={setFunc} />,
        },
        {
            id: 2,
            name: "due",
            icon: <img src={hourglass} />,
            display: task.due_date ? formatted_due_datetime : t("none"),
            component: <Due task={task} setFunc={setFunc} />,
        },
        {
            id: 3,
            name: "reminder",
            icon: <img src={alarmclock} />,
            display:
                task?.reminders && task.reminders?.length !== 0 ? (
                    <RemindersBox name="reminder">
                        {task.reminders.map((reminder) => (
                            <ReminderBlock key={reminder.id} name="reminder">
                                {displayReminder[0][reminder.delta]}
                            </ReminderBlock>
                        ))}
                    </RemindersBox>
                ) : task.due_date ? (
                    <EmptyReminderBox name="reminder">+</EmptyReminderBox>
                ) : (
                    <EmptyReminderBox
                        name="none"
                        onClick={() => {
                            toast.error(
                                t("reminder.reminder_before_due_date"),
                                { toastId: "reminder_before_due_date" },
                            )
                        }}>
                        -
                    </EmptyReminderBox>
                ),
            component: <Reminder task={task} />,
        },
        {
            id: 4,
            name: "priority",
            icon: <FeatherIcon icon="alert-circle" />,
            display: priorities[task.priority],
            component: <Priority setFunc={setFunc} />,
        },
        {
            id: 5,
            name: "drawer",
            icon: <FeatherIcon icon="archive" />,
            display:
                task.project_name === "Inbox"
                    ? `${task.project_name}`
                    : task.drawer_name
                      ? `${task.project_name} / ${task.drawer_name}`
                      : t("none"),
            component: <Drawer setFunc={setFunc} />,
        },
        {
            id: 6,
            name: "memo",
            icon: <FeatherIcon icon="edit" />,
            display: task.memo ? task.memo : t("none"),
            component: <Memo previousMemo={task.memo} setFunc={setFunc} />,
        },
    ]

    return (
        <ContentsBlock>
            {items.map((item) => (
                <Fragment key={item.id}>
                    <ContentsBox>
                        <ToolTip message={item.name}>{item.icon}</ToolTip>
                        <VLine $end={item.id === 1 || item.id === 6} />
                        <ContentText
                            name={item.name}
                            onClick={handleClickContent}>
                            {item.display}
                        </ContentText>
                        {content === item.name && isComponentOpen ? (
                            <ModalWindow afterClose={closeComponent} additional>
                                {item.component}
                            </ModalWindow>
                        ) : null}
                    </ContentsBox>
                </Fragment>
            ))}
        </ContentsBlock>
    )
}

const ContentsBlock = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 3.8em;
`

const ContentsBox = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    & svg,
    img {
        width: 1.3em;
        height: 1.3em;
        stroke: ${(p) => p.theme.textColor};
        margin-top: 1.3em;
        top: 0;
    }

    & img {
        filter: ${(p) => p.theme.project.imgColor};
        margin-right: 8px;
    }
`

const VLine = styled.div`
    border-left: thin solid ${(p) => p.theme.project.lineColor};
    height: 1em;
    margin-top: 1.3em;
    margin-left: 1em;
    transform: scale(1, 5);

    ${({ $end }) =>
        $end
            ? css`
                  transform: scale(1, 1.2);
              `
            : null}
`

const ContentText = styled.div`
    width: 31em;
    font-style: normal;
    font-size: 1.2em;
    color: ${(p) => p.theme.textColor};
    margin-top: 1.1em;
    margin-left: 1.3em;
    text-decoration: none;
    white-space: nowrap;
    overflow-x: clip;
    text-overflow: ellipsis;

    &:hover {
        cursor: pointer;
    }
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

export default Contents
