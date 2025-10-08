import { useEffect, useState } from "react"

import styled from "styled-components"

import CommonCalendar from "@components/common/CommonCalendar"

import { type MinimalTask } from "@api/tasks.api"

import { useClientTimezone } from "@utils/clientSettings"
import { ifMobile } from "@utils/useScreenType"

import { DateTime } from "luxon"

const TaskDetailCompleted = ({
    setFunc,
}: {
    setFunc: (diff: Partial<MinimalTask>) => void
}) => {
    const tz = useClientTimezone()

    const today = DateTime.now().setZone(tz)

    const [selectedDate, setSelectedDate] = useState<string | null>(
        today.toISODate(),
    )

    useEffect(() => {
        if (selectedDate === null) return

        setFunc({
            completed_at: DateTime.fromISO(selectedDate, {
                zone: tz,
            }).toISODate(),
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, tz])

    return (
        <FlexCenterBox>
            <CalendarWrapper>
                <CommonCalendar
                    isRangeSelectMode={false}
                    selectedStartDate={selectedDate}
                    setSelectedStartDate={setSelectedDate}
                    selectedEndDate={undefined}
                    setSelectedEndDate={undefined}
                    handleClose={undefined}
                />
            </CalendarWrapper>
        </FlexCenterBox>
    )
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

const CalendarWrapper = styled.div`
    margin: 0.4em auto;
    width: 90%;
    font-size: 0.8em;
`

export default TaskDetailCompleted
