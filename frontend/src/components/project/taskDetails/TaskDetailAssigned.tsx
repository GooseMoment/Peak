import { Fragment, useEffect, useState } from "react"

import styled, { css } from "styled-components"

import CommonCalendar from "@components/common/CommonCalendar"
import QuickDue from "@components/project/due/QuickDue"

import { type MinimalTask } from "@api/tasks.api"

import { useClientTimezone } from "@utils/clientSettings"
import { ifMobile } from "@utils/useScreenType"

import { cubicBeizer, rotateToUnder, rotateToUp } from "@assets/keyframes"

import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

type AssignedKey = "quick" | "calendar"

const TaskDetailAssigned = ({
    assignedAt,
    setFunc,
}: {
    assignedAt: string | null | undefined
    setFunc: (diff: Partial<MinimalTask>) => void
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task" })
    const tz = useClientTimezone()

    const today = DateTime.now().setZone(tz)

    const [selectedDate, setSelectedDate] = useState<string | null>(
        assignedAt || today.toISODate(),
    )
    const [isAdditionalComp, setIsAdditionalComp] =
        useState<AssignedKey | null>("quick")

    const handleAdditionalComp = (name: AssignedKey) => {
        if (isAdditionalComp === name) {
            setIsAdditionalComp(null)
        } else {
            setIsAdditionalComp(name)
        }
    }

    const changeAssignedDate = (
        set: { days: number } | { months: number } | null,
    ) => {
        return async () => {
            let assigned_at = null

            if (set !== null) {
                const date = today.plus(set)
                assigned_at = date.toISODate()
            }
            setFunc({ assigned_at })
        }
    }

    useEffect(() => {
        if (selectedDate === null) return

        setFunc({
            assigned_at: DateTime.fromISO(selectedDate, {
                zone: tz,
            }).toISODate(),
        })
    }, [selectedDate, setFunc, tz])

    const addComponent = [
        {
            name: "quick" as const,
            display: t("due.quick.title"),
            icon: "menu" as const,
            component: <QuickDue changeDueDate={changeAssignedDate} />,
        },
        {
            name: "calendar" as const,
            display: t("due.calendar"),
            icon: "calendar" as const,
            component: (
                <CommonCalendar
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    isModal
                />
            ),
        },
    ]

    return addComponent.map((comp, i) => (
        <Fragment key={comp.name}>
            <FlexCenterBox>
                <IndexBox
                    $start={i === 0}
                    $end={i === 1}
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
            {i !== 1 && <CLine />}
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

export default TaskDetailAssigned
