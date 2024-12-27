import { useState, useEffect } from "react"

import styled, { css } from "styled-components"

import QuickDue from "@components/project/due/QuickDue"
import CommonCalendar from "@components/common/CommonCalendar"
import RepeatDetail from "@components/project/due/RepeatDetail"
import TimeDetail from "@components/project/due/TimeDetail"

import { useClientTimezone } from "@utils/clientSettings"
import { ifMobile } from "@utils/useScreenType"

import { cubicBeizer } from "@assets/keyframes"
import { rotateToUnder, rotateToUp } from "@assets/keyframes"

import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const Due = ({ task, setFunc }) => {
    const { t } = useTranslation(null, { keyPrefix: "task.due" })
    const tz = useClientTimezone()

    const today = DateTime.now().setZone(tz)

    const [selectedDate, setSelectedDate] = useState(today.toISODate())
    const [isAdditionalComp, setIsAdditionalComp] = useState("quick")

    useEffect(() => {
        if (task.due_type === "due_datetime") {
            const converted_selectedDate = DateTime.fromISO(selectedDate, {
                zone: tz,
            })
            const due_datetime = DateTime.fromISO(task.due_datetime, {
                zone: tz,
            })
            const converted_datetime = due_datetime.set({
                year: converted_selectedDate.year,
                month: converted_selectedDate.month,
                day: converted_selectedDate.day,
            })
            setFunc({ due_datetime: converted_datetime })
            return
        }

        setFunc({ 
            due_type: "due_date",
            due_date: DateTime.fromISO(selectedDate, { zone: tz }).toISODate(),
            due_datetime: null,
        })
    }, [selectedDate])

    const handleAdditionalComp = (name) => {
        if (isAdditionalComp === name) setIsAdditionalComp("")
        else {
            if (name === "time") {
                if (task.type === "due_date" && !task.due_date) {
                    toast.error(t("time.no_due_before_time"), {
                        toastId: "handle_time_open",
                    })
                    return
                }
            }
            if (name === "repeat") {
                toast.error("coming soon...", { toastId: "coming_soon" })
                return
            }
            setIsAdditionalComp(name)
        }
    }

    const changeDueDate = (set) => {
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
                const converted_datetime = due_datetime.set({
                    year: date.year,
                    month: date.month,
                    day: date.day,
                })
                setFunc({ due_datetime: converted_datetime })
                return
            }

            setFunc({
                due_type: "due_date",
                due_date: date.toISODate(),
                due_datetime: null,
            })
        }
    }

    const addComponent = [
        {
            name: "quick",
            display: t("quick.title"),
            icon: "menu",
            component: <QuickDue changeDueDate={changeDueDate} />,
        },
        {
            name: "calendar",
            display: t("calendar"),
            icon: "calendar",
            component: <CalendarWrapper>
                <CommonCalendar
                    isRangeSelectMode={false}
                    selectedStartDate={selectedDate}
                    setSelectedStartDate={setSelectedDate}/>
            </CalendarWrapper>,
        },
        {
            name: "time",
            display: t("time.title"),
            icon: "clock",
            component: <TimeDetail task={task} setFunc={setFunc} />,
        },
        {
            name: "repeat",
            display: t("repeat.title"),
            icon: "refresh-cw",
            component: <RepeatDetail />,
        },
    ]

    return addComponent.map((comp, i) => (
        <FlexCenterBox key={comp.name}>
            <FlexCenterBox>
                <IndexBox
                    $start={i === 0}
                    $end={i === 3}
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
            {i !== 3 && <CLine />}
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

const IndexBox = styled.div`
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

const CollapseButton = styled.div`
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

export default Due
