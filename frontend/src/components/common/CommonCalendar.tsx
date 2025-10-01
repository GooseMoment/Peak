import { useState } from "react"

import styled from "styled-components"

import { useClientLocale } from "@utils/clientSettings"

import { enUS, ko } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import { useTranslation } from "react-i18next"

const CommonCalendar = ({
    selectedDate,
    setSelectedDate,
    isModal = false,
}: {
    selectedDate: string | null
    setSelectedDate: (dateISO: string) => void
    isModal?: boolean
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "common" })

    const locale = useClientLocale()

    const today = new Date()
    const [month, setMonth] = useState(today)
    const [selected, setSelected] = useState(
        selectedDate ? new Date(selectedDate) : undefined,
    )

    const onSelect = (date: Date) => {
        setSelected(date)
        setSelectedDate(date.toISOString())
    }

    const onTodayBtnClick = () => {
        setMonth(today)
        setSelected(today)
        setSelectedDate(today.toISOString())
    }

    return (
        <CalendarWrapper>
            <StyledDayPicker
                animate
                mode="single"
                required
                showOutsideDays
                captionLayout="dropdown"
                locale={locale == "ko" ? ko : enUS}
                month={month}
                onMonthChange={setMonth}
                selected={selected}
                onSelect={onSelect}
                $isModal={isModal}
                footer={
                    <TodayButton onClick={onTodayBtnClick}>
                        {t("button_today")}
                    </TodayButton>
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

const TodayButton = styled.div`
    background-color: ${(p) => p.theme.backgroundColor};
    color: ${(p) => p.theme.textColor};
    font-size: 1rem;
    cursor: pointer;
    margin: 0.5rem;

    display: flex;
    justify-content: center;
    align-items: center;
`

export default CommonCalendar
