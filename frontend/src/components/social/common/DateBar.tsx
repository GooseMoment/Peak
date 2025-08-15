import { type Dispatch, type SetStateAction, useEffect, useState } from "react"

import styled from "styled-components"

import CommonCalendar from "@components/common/CommonCalendar"
import MildButton from "@components/common/MildButton"

import { useClientLocale, useClientTimezone } from "@utils/clientSettings"
import { ifMobile } from "@utils/useScreenType"

import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"

interface DateBarProps {
    date: DateTime
    setDate: Dispatch<SetStateAction<DateTime>>
}

export default function DateBar({ date, setDate }: DateBarProps) {
    const locale = useClientLocale()
    const tz = useClientTimezone()

    const handleDate = (diff: number) => {
        setDate(date.plus({ days: diff }))
    }

    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    useEffect(() => {
        setIsCalendarOpen(false)
    }, [date])

    return (
        <Frame>
            <CalendarNavigator>
                <NavButton onClick={() => handleDate(-7)}>
                    <FeatherIcon icon="chevrons-left" />
                </NavButton>
                <NavButton onClick={() => handleDate(-1)}>
                    <FeatherIcon icon="chevron-left" />
                </NavButton>
                <DateBox
                    onClick={() => {
                        setIsCalendarOpen((prev) => !prev)
                    }}>
                    {date.setLocale(locale).toLocaleString({
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                    })}
                </DateBox>
                <NavButton onClick={() => handleDate(1)}>
                    <FeatherIcon icon="chevron-right" />
                </NavButton>
                <NavButton onClick={() => handleDate(7)}>
                    <FeatherIcon icon="chevrons-right" />
                </NavButton>
            </CalendarNavigator>

            {isCalendarOpen && (
                <CalendarWrapper>
                    <CommonCalendar
                        isRangeSelectMode={false}
                        selectedStartDate={date.toISO()}
                        setSelectedStartDate={(selectedDate: string) =>
                            setDate(DateTime.fromISO(selectedDate).setZone(tz))
                        }
                        selectedEndDate={undefined}
                        setSelectedEndDate={undefined}
                        handleClose={undefined}
                    />
                </CalendarWrapper>
            )}
        </Frame>
    )
}

const Frame = styled.div`
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
`

const CalendarNavigator = styled.div`
    margin: 0.5em 1em 0.5em;
    width: 100%;
    max-width: 35rem;
    height: 1.2em;

    font-size: 1.2em;
    display: flex;
    flex-direction: row;
`

const NavButton = styled(MildButton)`
    height: 100%;
    min-width: 1.5em;

    display: flex;
    justify-content: center;
    align-items: center;

    & svg {
        top: unset;
        margin-right: unset;
    }
`

const DateBox = styled.div`
    min-width: 7em;
    flex-grow: 1;

    text-align: center;
    font-weight: 500; // Bold: 700
`

const CalendarWrapper = styled.div`
    margin: 0 auto;
    width: 80%;
    max-width: 35rem;

    ${ifMobile} {
        min-width: 310px;

        font-size: 0.9em;
    }
`
