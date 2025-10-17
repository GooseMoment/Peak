import { type Dispatch, type SetStateAction, useMemo } from "react"

import styled from "styled-components"

import CommonCalendar from "@components/common/CommonCalendar"
import MildButton from "@components/common/MildButton"

import { useClientLocale, useClientTimezone } from "@utils/clientSettings"
import useModal, { Portal } from "@utils/useModal"

import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"

interface DateBarProps {
    date: DateTime
    setDate: Dispatch<SetStateAction<DateTime>>
}

export default function DateBar({ date, setDate }: DateBarProps) {
    const locale = useClientLocale()
    const tz = useClientTimezone()
    const modal = useModal()

    const handleDate = (diff: number) => {
        setDate(date.plus({ days: diff }))
    }

    const dateLocaleString = useMemo(() => {
        const now = DateTime.now().setZone(tz)

        return date.setLocale(locale).toLocaleString({
            year: date.hasSame(now, "year") ? undefined : "numeric",
            weekday: "short",
            month: "short",
            day: "numeric",
        })
    }, [date, locale, tz])

    return (
        <Frame>
            <Navigator>
                <NavButton onClick={() => handleDate(-7)}>
                    <FeatherIcon icon="chevrons-left" />
                </NavButton>
                <NavButton onClick={() => handleDate(-1)}>
                    <FeatherIcon icon="chevron-left" />
                </NavButton>
                <CalendarButton onClick={() => modal.openModal()}>
                    {dateLocaleString}
                </CalendarButton>
                <NavButton onClick={() => handleDate(1)}>
                    <FeatherIcon icon="chevron-right" />
                </NavButton>
                <NavButton onClick={() => handleDate(7)}>
                    <FeatherIcon icon="chevrons-right" />
                </NavButton>
            </Navigator>
            <Portal modal={modal}>
                <ModalCalendarWrapper>
                    <CommonCalendar
                        selectedDate={date}
                        setSelectedDate={setDate}
                        isModal
                    />
                </ModalCalendarWrapper>
            </Portal>
        </Frame>
    )
}

const Frame = styled.div`
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
`

const Navigator = styled.div`
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

const CalendarButton = styled(MildButton)`
    min-width: 7em;
    flex-grow: 1;

    text-align: center;
    font-weight: 500;
`

const ModalCalendarWrapper = styled.div`
    padding: 1em;
    background-color: ${(p) => p.theme.backgroundColor};
    border-radius: 16px;
`
