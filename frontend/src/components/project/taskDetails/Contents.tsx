import {
    Dispatch,
    Fragment,
    MouseEvent,
    SetStateAction,
    useCallback,
    useMemo,
    useState,
} from "react"

import styled, { css } from "styled-components"

import Detail from "@components/project/common/Detail"
import ToolTip from "@components/project/common/ToolTip"
import type { TaskContent } from "@components/tasks/contents"
import useTaskDateDisplay from "@components/tasks/utils/useTaskDateDisplay"

import TaskDetailAssigned from "./TaskDetailAssigned"
import TaskDetailDrawer from "./TaskDetailDrawer"
import TaskDetailDue from "./TaskDetailDue"
import TaskDetailMemo from "./TaskDetailMemo"
import TaskDetailPriority from "./TaskDetailPriority"
import TaskDetailReminder from "./TaskDetailReminder"

import type { MinimalTask } from "@api/tasks.api"

import useModal, { Portal } from "@utils/useModal"

import type { PaletteColorName } from "@assets/palettes"
import AlarmClock from "@assets/project/AlarmClock"
import Hourglass from "@assets/project/Hourglass"

import FeatherIcon from "feather-icons-react"
import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

/// priority, drawer가 있어야함
const Contents = ({
    task,
    setFunc,
    setNewColor,
}: {
    task: MinimalTask
    setFunc: (diff: Partial<MinimalTask>) => void
    setNewColor: Dispatch<SetStateAction<PaletteColorName>>
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task" })

    const priorities = useMemo(() => makePriorities(t), [t])
    const displayReminder: Record<number, string> = useMemo(
        () => makeDisplayReminder(t),
        [t],
    )

    // text클릭 시 알맞는 component 띄우기
    const [content, setContent] = useState<TaskContent | null>(null)
    const modal = useModal({
        afterClose: () => setContent(null),
    })

    const handleClickContent = (e: MouseEvent<HTMLElement>) => {
        const target = e.target
        if (!(target instanceof HTMLElement)) return

        const el = target.closest<HTMLElement>("[data-name]")
        if (!el) return

        const name = el.dataset.name
        if (!name) return

        setContent(name as TaskContent | null)
        modal.openModal()
    }

    const closeComponent = useCallback(() => {
        modal.closeModal()
    }, [modal])

    const { formatted_due_datetime, formatted_assigned_date } =
        useTaskDateDisplay(task)

    const items = useMemo(
        () => [
            {
                id: 1,
                name: "assigned" as const,
                icon: <FeatherIcon icon="calendar" />,
                display: task.assigned_at ? formatted_assigned_date : t("none"),
                component: <TaskDetailAssigned setFunc={setFunc} />,
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
                    task.reminders && task.reminders.length !== 0 ? (
                        <RemindersBox data-name="reminder">
                            {task.reminders.map((reminder, i) => (
                                <ReminderBlock key={i} data-name="reminder">
                                    {displayReminder[reminder.delta]}
                                </ReminderBlock>
                            ))}
                        </RemindersBox>
                    ) : task.due_type ? (
                        <EmptyReminderBox data-name="reminder">
                            +
                        </EmptyReminderBox>
                    ) : (
                        <EmptyReminderBox
                            data-name="none"
                            onClick={(e) => {
                                e.stopPropagation()
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
                    <TaskDetailPriority
                        setFunc={setFunc}
                        onClose={closeComponent}
                    />
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
                component: (
                    <TaskDetailDrawer
                        setFunc={setFunc}
                        onClose={closeComponent}
                        setNewColor={setNewColor}
                    />
                ),
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
                        onClose={closeComponent}
                    />
                ),
            },
        ],
        [
            closeComponent,
            displayReminder,
            formatted_assigned_date,
            formatted_due_datetime,
            priorities,
            setFunc,
            setNewColor,
            t,
            task,
        ],
    )

    const component = useMemo(() => {
        return items.find((item) => item.name === content)?.component
    }, [content, items])

    return (
        <ContentsBlock>
            {items.map((item) => (
                <Fragment key={item.id}>
                    <ContentsBox>
                        <ToolTip message={t(`${item.name}.name`)}>
                            {item.icon}
                        </ToolTip>

                        <VLine $end={item.id === 1 || item.id === 6} />

                        <ContentText
                            data-name={
                                item.name === "reminder" ? undefined : item.name
                            }
                            onClick={handleClickContent}
                            $isReminder={item.name === "reminder"}>
                            {item.display}
                        </ContentText>
                    </ContentsBox>
                </Fragment>
            ))}
            <Portal modal={modal}>
                <Detail
                    title={content ? t(`${content}.title`) : t("none")}
                    onClose={closeComponent}
                    special={content === "assigned" || content === "due"}>
                    {component}
                </Detail>
            </Portal>
        </ContentsBlock>
    )
}

const ContentsBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 3.8em;
`

const ContentsBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;

    & svg {
        width: 1.3em;
        height: 1.3em;
        stroke: ${(p) => p.theme.textColor};
        margin-top: 1.3em;
        margin-right: 8px;
        top: 0;
    }
`

const VLine = styled.div<{ $end: boolean }>`
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

const ContentText = styled.button<{ $isReminder: boolean }>`
    all: unset;
    text-decoration: none;
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
    cursor: ${(props) => (props.$isReminder ? "normal" : "pointer")};
`

const RemindersBox = styled.button`
    all: unset;
    text-decoration: none;
    display: flex;
    gap: 0.5em;
`

const ReminderBlock = styled.button`
    all: unset;
    text-decoration: none;
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

const EmptyReminderBox = styled.button`
    all: unset;
    text-decoration: none;
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

export default Contents
