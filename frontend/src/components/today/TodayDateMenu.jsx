import styled from "styled-components"

import CommonCalendar from "@components/common/CommonCalendar"

import { useClientTimezone } from "@utils/clientSettings"

import { Menu, MenuItem } from "@assets/menu"

import { MenuButton } from "@szhsin/react-menu"
import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"

const TodayDateMenu = ({ selectedDate, setSelectedDate }) => {
    const tz = useClientTimezone()

    const handleChangeDate = (date) => {
        const iso = DateTime.fromISO(date, { zone: tz }).toISODate()
        setSelectedDate(iso)
    }

    return (
        <DateMenu
            menuButton={
                <DateMenuBtn>
                    <FeatherIcon icon="calendar" />
                </DateMenuBtn>
            }
            transition
            align="end">
            <DateMenuItem aria-disabled onClick={(e) => e.stopPropagation()}>
                <CalendarWrapper onClick={(e) => e.stopPropagation()}>
                    <CommonCalendar
                        isRangeSelectMode={false}
                        selectedStartDate={selectedDate}
                        setSelectedStartDate={handleChangeDate}
                    />
                </CalendarWrapper>
            </DateMenuItem>
        </DateMenu>
    )
}

const DateMenu = styled(Menu)`
    & ul {
        background-color: ${(p) => p.theme.backgroundColor};
    }
`

const DateMenuItem = styled(MenuItem)`
    &:hover {
        background-color: ${(p) => p.theme.backgroundColor};
    }
`

const DateMenuBtn = styled(MenuButton)`
    color: ${(p) => p.theme.textColor};
    background-color: transparent;
    border: 0;
    cursor: pointer;

    & svg {
        font-size: 1.5em;
    }
`

const CalendarWrapper = styled.div`
    margin: 0.4em auto;
    width: 90%;
    max-width: 20rem;
`

export default TodayDateMenu
