import { useState } from "react"

import styled from "styled-components"

import CommonCalendar from "@components/common/CommonCalendar"

import { type MinimalTask } from "@api/tasks.api"

import { useClientTimezone } from "@utils/clientSettings"
import { ifMobile } from "@utils/useScreenType"

import { DateTime } from "luxon"

const TaskDetailCompleted = ({
    completedAt,
    setFunc,
}: {
    completedAt: string | null | undefined
    setFunc: (diff: Partial<MinimalTask>) => void
}) => {
    const tz = useClientTimezone()

    const [selectedDate, setSelectedDate] = useState<DateTime | null>(
        completedAt
            ? DateTime.fromISO(completedAt, {
                  zone: tz,
              })
            : null,
    )

    const handleSelectedDateChange = (date: DateTime | null) => {
        setSelectedDate(date)

        if (!date || !date.isValid) {
            setFunc({ completed_at: null })
            return
        }
        setFunc({
            completed_at: date.toISODate(),
        })
    }

    return (
        <FlexCenterBox>
            <CalendarWrapper>
                <CommonCalendar
                    selectedDate={selectedDate}
                    setSelectedDate={handleSelectedDateChange}
                    isModal
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
