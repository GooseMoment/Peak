import { useState } from "react"

import styled from "styled-components"

import { useClientLocale, useClientTimezone } from "@utils/clientSettings"

import { enUS, ko } from "date-fns/locale"
import { DateTime } from "luxon"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import { useTranslation } from "react-i18next"

const CommonCalendar = ({
    selectedDate,
    setSelectedDate,
    isModal = false,
}: {
    selectedDate: DateTime | null
    setSelectedDate: (dateTime: DateTime) => void
    isModal?: boolean
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "common" })
    const tz = useClientTimezone()

    const locale = useClientLocale()

    const today = new Date()
    const startMonth = new Date(today.getFullYear() - 2, 0)
    const endMonth = new Date(today.getFullYear() + 2, 11)
    const [month, setMonth] = useState(() => {
        const today = new Date()
        return selectedDate ? selectedDate.toJSDate() : today
    })

    const onSelect = (date: Date | undefined) => {
        if (!date) return
        const dateTime = DateTime.fromJSDate(date, { zone: tz })
        setSelectedDate(dateTime)
    }

    const onTodayBtnClick = () => {
        setMonth(new Date())
        setSelectedDate(DateTime.now().setZone(tz))
    }

    return (
        <CalendarWrapper>
            <StyledDayPicker
                animate
                mode="single"
                {...(!isModal && { required: true })}
                showOutsideDays
                captionLayout="dropdown"
                locale={locale === "ko" ? ko : enUS}
                month={month}
                onMonthChange={setMonth}
                selected={selectedDate ? selectedDate.toJSDate() : undefined}
                onSelect={onSelect}
                startMonth={startMonth}
                endMonth={endMonth}
                $isModal={isModal}
                footer={
                    <TodayButtonWrapper>
                        <TodayButton onClick={onTodayBtnClick}>
                            {t("button_today")}
                        </TodayButton>
                    </TodayButtonWrapper>
                }
            />
        </CalendarWrapper>
    )
}

const CalendarWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    color: ${(p) => p.theme.textColor};
`

const StyledDayPicker = styled(DayPicker)<{ $isModal?: boolean }>`
    .rdp-month_grid {
        width: 100%;
        justify-content: center;
        border-collapse: collapse;
    }

    .rdp-day {
        font-size: 1em;
    }

    .rdp-selected .rdp-day_button {
        border-color: ${(p) => p.theme.textColor};
        background-color: ${(p) => p.theme.textColor};
        color: ${(p) => p.theme.backgroundColor};
    }

    .rdp-today:not(.rdp-outside) {
        color: ${(p) => p.theme.goose};
    }

    .rdp-chevron {
        fill: ${(p) => p.theme.primaryColors.text};
    }

    ${(p) =>
        p.$isModal &&
        `
            font-size: 1rem;
            transform: scale(0.9);
        `}
`

const TodayButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const TodayButton = styled.button`
    border: none;

    background-color: ${(p) => p.theme.backgroundColor};
    color: ${(p) => p.theme.textColor};
    font-size: 1rem;
    cursor: pointer;
    margin: 0.5rem;

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        color: ${(p) => p.theme.social.buttonColor};
    }

    &:focus-visible {
        outline: 2px solid ${(p) => p.theme.goose};
    }
`

export default CommonCalendar
