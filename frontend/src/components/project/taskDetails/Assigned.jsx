import { Fragment, useEffect, useState } from "react"

import styled, { css } from "styled-components"

import CommonCalendar from "@components/common/CommonCalendar"
import QuickDue from "@components/project/due/QuickDue"
import RepeatDetail from "@components/project/due/RepeatDetail"

import { useClientTimezone } from "@utils/clientSettings"
import { ifMobile } from "@utils/useScreenType"

import { cubicBeizer } from "@assets/keyframes"
import { rotateToUnder, rotateToUp } from "@assets/keyframes"

import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const Assigned = ({ setFunc, onClose }) => {
    const { t } = useTranslation(null, { keyPrefix: "task" })
    const tz = useClientTimezone()

    const today = DateTime.now().setZone(tz)

    const [selectedDate, setSelectedDate] = useState(today.toISODate())
    const [isAdditionalComp, setIsAdditionalComp] = useState("quick")

    const handleAdditionalComp = (name) => {
        if (isAdditionalComp === name) setIsAdditionalComp("")
        else {
            if (name === "repeat") {
                toast.error("coming soon...", { toastId: "coming_soon" })
                return
            }
            setIsAdditionalComp(name)
        }
    }

    const changeAssignedDate = (set) => {
        return async () => {
            let assigned_at = null

            if (set !== null) {
                const date = today.plus(set)
                assigned_at = date.toISODate()
            }
            setFunc({ assigned_at })
            onClose()
        }
    }

    useEffect(() => {
        setFunc({
            assigned_at: DateTime.fromISO(selectedDate, {
                zone: tz,
            }).toISODate(),
        })
    }, [selectedDate])

    const addComponent = [
        {
            name: "quick",
            display: t("due.quick.title"),
            icon: "menu",
            component: <QuickDue changeDueDate={changeAssignedDate} />,
        },
        {
            name: "calendar",
            display: t("due.calendar"),
            icon: "calendar",
            component: (
                <CalendarWrapper>
                    <CommonCalendar
                        isRangeSelectMode={false}
                        selectedStartDate={selectedDate}
                        setSelectedStartDate={setSelectedDate}
                    />
                </CalendarWrapper>
            ),
        },
        {
            name: "repeat",
            display: t("due.repeat.title"),
            icon: "refresh-cw",
            component: <RepeatDetail />,
        },
    ]

    return addComponent.map((comp, i) => (
        <Fragment key={comp.name}>
            <FlexCenterBox>
                <IndexBox
                    $start={i === 0}
                    $end={i === 2}
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
        </Fragment>
    ))
}

const FlexCenterBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    ${ifMobile} {
        width: 100%;
    }
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

export default Assigned
