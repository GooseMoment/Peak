import { useState } from "react"

import styled, { css } from "styled-components"

import CommonCalendar from "@components/common/CommonCalendar"
import QuickDue from "@components/project/due/QuickDue"
import TimeDetail from "@components/project/due/TimeDetail"

import { type MinimalTask } from "@api/tasks.api"

import { useClientTimezone } from "@utils/clientSettings"
import { ifMobile } from "@utils/useScreenType"

import { cubicBeizer, rotateToUnder, rotateToUp } from "@assets/keyframes"

import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

type DueKey = "quick" | "calendar" | "time"

const TaskDetailDue = ({
    task,
    setFunc,
}: {
    task: MinimalTask
    setFunc: (diff: Partial<MinimalTask>) => void
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task.due" })
    const tz = useClientTimezone()

    const today = DateTime.now().setZone(tz)

    const [selectedDate, setSelectedDate] = useState(today.toISODate())
    const [isAdditionalComp, setIsAdditionalComp] = useState("quick")

    const handleAdditionalComp = (name: DueKey) => {
        if (isAdditionalComp === name) setIsAdditionalComp("")
        else {
            if (name === "time") {
                if (task.due_type === null) {
                    toast.error(t("time.no_due_before_time"), {
                        toastId: "handle_time_open",
                    })
                    return
                }
            }
            setIsAdditionalComp(name)
        }
    }

    const changeDueDate = (
        set: { days: number } | { months: number } | null,
    ) => {
        return async () => {
            if (set === null) {
                setFunc({ due_type: null, due_date: null, due_datetime: null })
                return
            }

            const date = today.plus(set)

            if (task.due_type === "due_datetime") {
                const due_datetime = DateTime.fromISO(task.due_datetime, {
                    zone: tz,
                })
                const converted_datetime = due_datetime
                    .set({
                        year: date.year,
                        month: date.month,
                        day: date.day,
                    })
                    .toISO()

                if (converted_datetime === null) return

                setFunc({
                    due_type: "due_datetime",
                    due_date: null,
                    due_datetime: converted_datetime,
                })
                return
            }

            const coverted_date = date.toISODate()

            if (coverted_date === null) return

            setFunc({
                due_type: "due_date",
                due_date: coverted_date,
                due_datetime: null,
            })
        }
    }

    const handleSelectedDateChange = (date: string | null) => {
        setSelectedDate(date)

        if (date == null) {
            setFunc({
                due_type: null,
                due_date: null,
                due_datetime: null,
            })
            return
        }

        if (task.due_type === "due_datetime") {
            const converted_selectedDate = DateTime.fromISO(date, {
                zone: tz,
            })
            if (!converted_selectedDate.isValid) return
            const due_datetime = DateTime.fromISO(task.due_datetime, {
                zone: tz,
            })
            if (!due_datetime.isValid) return

            const converted_datetime = due_datetime
                .set({
                    year: converted_selectedDate.year,
                    month: converted_selectedDate.month,
                    day: converted_selectedDate.day,
                })
                .toISO()

            if (converted_datetime === null) return

            setFunc({
                due_type: "due_datetime",
                due_date: null,
                due_datetime: converted_datetime,
            })
            return
        }

        const converted_date = DateTime.fromISO(date, {
            zone: tz,
        })
        if (!converted_date.isValid) return

        const converted_date_str = converted_date.toISODate()
        if (converted_date_str === null) return

        setFunc({
            due_type: "due_date",
            due_date: converted_date_str,
            due_datetime: null,
        })
    }

    const addComponent = [
        {
            name: "quick" as const,
            display: t("quick.title"),
            icon: "menu" as const,
            component: <QuickDue changeDueDate={changeDueDate} />,
        },
        {
            name: "calendar" as const,
            display: t("calendar"),
            icon: "calendar" as const,
            component: (
                <CalendarWrapper>
                    <CommonCalendar
                        isRangeSelectMode={false}
                        selectedStartDate={selectedDate}
                        setSelectedStartDate={handleSelectedDateChange}
                        selectedEndDate={undefined}
                        setSelectedEndDate={undefined}
                        handleClose={undefined}
                    />
                </CalendarWrapper>
            ),
        },
        {
            name: "time" as const,
            display: t("time.title"),
            icon: "clock" as const,
            component: task.due_type !== null && (
                <TimeDetail task={task} setFunc={setFunc} />
            ),
        },
    ]

    return addComponent.map((comp, i) => (
        <FlexCenterBox key={comp.name}>
            <FlexCenterBox>
                <IndexBox
                    $start={i === 0}
                    $end={isAdditionalComp !== comp.name && i === 2}
                    onClick={() => handleAdditionalComp(comp.name)}>
                    <EmptyBlock />
                    <Box>
                        <FeatherIcon icon={comp.icon} />
                        {comp.display}
                    </Box>
                    <CollapseButton $collapsed={isAdditionalComp === comp.name}>
                        <FeatherIcon icon="chevron-down" />
                    </CollapseButton>
                </IndexBox>
            </FlexCenterBox>
            {isAdditionalComp === comp.name && comp.component}
            {i !== 2 && <CLine />}
        </FlexCenterBox>
    ))
}

const FlexCenterBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
`

const CLine = styled.div`
    border-top: thin solid ${(p) => p.theme.project.lineColor};
    width: 90%;
    margin: 0.8em;

    ${ifMobile} {
        width: 95%;
    }
`

const IndexBox = styled.div<{ $start: boolean; $end: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80%;
    height: 1.8em;
    background-color: ${(p) => p.theme.backgroundColor};
    border: solid 1px ${(p) => p.theme.project.borderColor};
    border-radius: 15px;
    color: ${(p) => p.theme.textColor};
    font-size: 1em;
    padding: 0em 0.5em;
    margin-top: ${(props) => (props.$start ? 0.8 : 0)}em;
    margin-bottom: ${(props) => (props.$end ? 0.8 : 0)}em;
    cursor: pointer;

    & svg {
        margin-right: unset;
    }

    &:hover {
        font-weight: bolder;
        color: ${(p) => p.theme.goose};
    }

    ${ifMobile} {
        width: 95%;
    }
`

const Box = styled.div`
    & svg {
        margin-right: 0.5em;
    }
`

const EmptyBlock = styled.div`
    width: 16px;
    height: 16px;
`

const CollapseButton = styled.div<{ $collapsed: boolean }>`
    & svg {
        animation: ${rotateToUp} 0.3s ${cubicBeizer} forwards;
    }

    ${(props) =>
        props.$collapsed &&
        css`
            & svg {
                animation: ${rotateToUnder} 0.3s ${cubicBeizer} forwards;
            }
        `}
`

const CalendarWrapper = styled.div`
    margin: 0.4em auto;
    width: 90%;
    font-size: 0.8em;
`

export default TaskDetailDue
