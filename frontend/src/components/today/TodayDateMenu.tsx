import { Dispatch, MouseEvent, SetStateAction } from "react"

import styled from "styled-components"

import CommonCalendar from "@components/common/CommonCalendar"

import { useClientTimezone } from "@utils/clientSettings"

import { Menu, MenuItem } from "@assets/menu"

import { MenuButton } from "@szhsin/react-menu"
import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"

const TodayDateMenu = ({
    selectedDate,
    setSelectedDate,
}: {
    selectedDate: string
    setSelectedDate: Dispatch<SetStateAction<string>>
}) => {
    const tz = useClientTimezone()

    const handleChangeDate = (date: string) => {
        const iso = DateTime.fromISO(date, { zone: tz }).toISODate()

        if (iso === null) return
        setSelectedDate(iso)
    }

    return (
        <div
            onClick={(e: MouseEvent<HTMLElement>) => {
                e.stopPropagation()
            }}>
            <DateMenu
                menuButton={
                    <DateMenuBtn>
                        <FeatherIcon icon="calendar" />
                    </DateMenuBtn>
                }
                transition
                align="end">
                <DateMenuItem aria-disabled>
                    <CalendarWrapper onClick={(e) => e.stopPropagation()}>
                        <CommonCalendar
                            selectedDate={selectedDate}
                            setSelectedDate={handleChangeDate}
                        />
                    </CalendarWrapper>
                </DateMenuItem>
            </DateMenu>
        </div>
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
    margin-bottom: 1rem;

    & svg {
        font-size: 1.5rem;
        margin-right: 0;
    }
`

const CalendarWrapper = styled.div`
    margin: 0.4em auto;
    width: 90%;
    width: 20rem;
`

export default TodayDateMenu
