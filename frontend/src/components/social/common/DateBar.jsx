import { useEffect, useState } from "react"

import styled from "styled-components"

import CommonCalendar from "@components/common/CommonCalendar"
import MildButton from "@components/common/MildButton"

import { useClientLocale } from "@utils/clientSettings"
import { ifMobile } from "@utils/useScreenType"

import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"

const DateBar = ({ selectedDate, setSelectedDate }) => {
    const locale = useClientLocale()

    // TODO: selectedDate를 Datetime형으로 바꾼 이후 다시 수정
    const displayDate = () => {
        const date = DateTime.fromISO(selectedDate)
        return date  
        .setLocale(locale)  
        .toLocaleString({  
            weekday: "short",
            month: "short",
            day: "numeric",
        })
    }

    const handleDate = (diff) => {
        const date = DateTime.fromISO(selectedDate)
        const newDate = date.plus({ days: diff })
        setSelectedDate(newDate.setZone("utc").toISO())
    }

    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    useEffect(() => {
        setIsCalendarOpen(false)
    }, [selectedDate])

    return (
        <Frame>
            <NavBar>
                <NavButton $buttonSize={1.5} onClick={() => handleDate(-7)}>
                    <FeatherIcon icon="chevrons-left" />
                </NavButton>
                <NavButton $buttonSize={2.5} onClick={() => handleDate(-1)}>
                    <FeatherIcon icon="chevron-left" />
                </NavButton>
                <DateBox
                    onClick={() => {
                        setIsCalendarOpen((prev) => !prev)
                    }}>
                    {displayDate()}
                </DateBox>
                <NavButton $buttonSize={2.5} onClick={() => handleDate(1)}>
                    <FeatherIcon icon="chevron-right" />
                </NavButton>
                <NavButton $buttonSize={1.5} onClick={() => handleDate(7)}>
                    <FeatherIcon icon="chevrons-right" />
                </NavButton>
            </NavBar>

            {isCalendarOpen && (
                <CalendarWrapper>
                    <CommonCalendar
                        isRangeSelectMode={false}
                        selectedStartDate={selectedDate}
                        setSelectedStartDate={setSelectedDate}
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

const NavBar = styled.div`
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
    min-width: ${(props) => props.$buttonSize}em;

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

export default DateBar
