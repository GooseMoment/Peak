import { useState } from "react"

import styled from "styled-components"

import { useClientLocale } from "@utils/clientSettings"

import moment from "moment"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"

const CommonCalendar = ({
    isRangeSelectMode,
    selectedStartDate,
    setSelectedStartDate,
    selectedEndDate,
    setSelectedEndDate,
    contentedDates = [],
    isModal = false,
    handleClose,
}) => {
    const [activeStartDate, setActiveStartDate] = useState(new Date())

    const locale = useClientLocale()

    const changeDate = (e) => {
        if (isModal) handleClose()

        if (isRangeSelectMode) {
            const startDate = moment(e[0]).toISOString()
            const endDate = moment(e[1]).toISOString()
            if (startDate === endDate) {
                setSelectedStartDate(null)
                setSelectedEndDate(null)
            } else {
                setSelectedStartDate(startDate)
                setSelectedEndDate(endDate)
            }
        } else {
            const startDate = moment(e).toISOString()
            if (selectedStartDate === startDate) {
                setSelectedStartDate(null)
            } else setSelectedStartDate(startDate)
        }
    }

    const handleTileContent = ({ date }) => {
        const contents = []
        const day = moment(date).toISOString()

        if (contentedDates.find((x) => x === day))
            contents.push(<StyledContentDot key={day} />)
        return <>{contents}</>
    }

    const handleTodayClick = () => {
        const today = new Date()
        setActiveStartDate(today)
    }

    return (
        <CalendarWrapper>
            <Calendar
                selectRange={isRangeSelectMode}
                onChange={changeDate}
                value={
                    isRangeSelectMode
                        ? [selectedStartDate, selectedEndDate]
                        : selectedStartDate
                }
                formatDay={(locale, date) => moment(date).format("D")}
                tileContent={handleTileContent}
                locale={locale}
                next2Label={null}
                prev2Label={null}
                minDetail="year"
                activeStartDate={activeStartDate ? activeStartDate : undefined}
                onActiveStartDateChange={({ activeStartDate }) =>
                    setActiveStartDate(activeStartDate)
                }
            />
            <TodayButton onClick={handleTodayClick}>TODAY</TodayButton>
        </CalendarWrapper>
    )
}

const StyledContentDot = styled.div`
    position: absolute;
    top: -0.1em;
    left: -0.1em;

    background-color: ${(p) => p.theme.accentColor};
    border-radius: 0.4em;
    outline: solid 0.125em ${(p) => p.theme.backgroundColor};
    width: 0.4em;
    height: 0.4em;
    transition-property: all;
    transition-duration: 0.25s;
    transition-timing-function: ease;
`

const CalendarWrapper = styled.div`
    position: relative;

    display: flex;

    .react-calendar {
        width: 100%;
        max-width: 100%;

        border: 0;
        background-color: ${(p) => p.theme.backgroundColor};

        font-family:
            Pretendard,
            -apple-system,
            BlinkMacSystemFont,
            system-ui,
            Roboto,
            "Helvetica Neue",
            "Segoe UI",
            "Apple SD Gothic Neo",
            "Noto Sans KR",
            "Malgun Gothic",
            sans-serif;
        font-size: 1.25em;
        line-height: 1.5em;
    }

    /* 네비게이션 */
    .react-calendar__navigation {
        margin-bottom: 0.5em;
    }

    /* 네비게이션 각 요소 정렬 */
    .react-calendar__navigation__label {
        order: 0;
        flex-grow: 0 !important;
        margin-right: auto;

        font-size: 1em;
    }
    .react-calendar__navigation__prev-button {
        order: 1;
    }
    .react-calendar__navigation__next-button {
        order: 2;
    }

    /* 네비게이션 폰트 설정 */
    .react-calendar__navigation button {
        position: relative;
        font-weight: 800;
        font-size: 1.2em;
        color: ${(p) => p.theme.textColor};
    }

    /* 네비게이션 버튼 컬러 */
    .react-calendar__navigation button:focus {
        background-color: ${(p) => p.theme.backgroundColor};
    }

    /* 요일 밑줄 제거 */
    .react-calendar__month-view__weekdays abbr {
        text-decoration: none;
        font-weight: 800;
    }

    /* 요일 주말 폰트 */ /* TODO: 작동 안 하고 있음 */
    .react-calendar__month-view__weekdays__weekday--weekend
        abbr[title="Sunday"] {
        color: red;
    }
    .react-calendar__month-view__weekdays__weekday--weekend
        abbr[title="Saturday"] {
        color: blue;
    }

    /* 일 타일 */
    .react-calendar__month-view__days__day {
        position: relative;
        flex-basis: 2.5em !important;
        margin: 0.7em calc((100% - 7 * 2.5em) / 14) 0.7em !important;
        height: 2.5em;

        border-radius: 3em;
        padding: 0.1em !important;
        transition-property: all;
        transition-duration: 0.25s;
        transition-timing-function: ease;

        overflow: visible !important;
        background-color: ${(p) => p.theme.calendar.backgroundColor} !important;

        &:hover > ${StyledContentDot} {
            top: -0.3em;
            left: -0.3em;

            height: 0.6em;
            width: 0.6em;
        }
    }

    /* 월 전체 */
    .react-calendar__month-view {
        overflow: hidden;
        /* 폰트 */
        abbr {
            color: ${(p) => p.theme.textColor} !important;
        }
    }
    /* 인접 월 */
    .react-calendar__month-view__days__day--neighboringMonth {
        background-color: ${(p) =>
            p.theme.calendar.secondBackgroundColor} !important;
        /* 폰트 */
        abbr {
            color: ${(p) => p.theme.secondTextColor} !important;
        }
    }

    /* 오늘 날짜 */
    .react-calendar__tile--now {
        background: ${(p) => p.theme.accentColor} !important;
        abbr {
            color: ${(p) => p.theme.calendar.todayColor} !important;
        }

        &.react-calendar__month-view__days__day--neighboringMonth {
            background-color: ${(p) =>
                p.theme.primaryColors.secondary} !important;
        }
    }

    /* .react-calendar__tile--active:not(.react-calendar__tile--rangeStart.react-calendar__tile--rangeEnd).react-calendar__tile--range */
    /* 선택한 날짜 스타일 적용 */
    .react-calendar__tile--rangeStart.react-calendar__tile--rangeEnd,
    .react-calendar__tile--active:not(.react-calendar__tile--range) {
        box-shadow:
            0 0 0 0.15em ${(p) => p.theme.backgroundColor},
            0 0 0 0.3em ${(p) => p.theme.calendar.backgroundColor};

        &.react-calendar__tile--now {
            box-shadow:
                0 0 0 0.15em ${(p) => p.theme.backgroundColor},
                0 0 0 0.3em ${(p) => p.theme.accentColor};
        }

        &.react-calendar__month-view__days__day--neighboringMonth {
            box-shadow:
                0 0 0 0.15em ${(p) => p.theme.backgroundColor},
                0 0 0 0.3em ${(p) => p.theme.calendar.secondBackgroundColor};

            &.react-calendar__tile--now {
                box-shadow:
                    0 0 0 0.15em ${(p) => p.theme.backgroundColor},
                    0 0 0 0.3em ${(p) => p.theme.primaryColors.secondary};
            }
        }
    }

    /* 달력 호버링 */
    .react-calendar__month-view__days__day:hover,
    .react-calendar__month-view__days__day:focus-visible {
        box-shadow:
            0 0 0 0.15em ${(p) => p.theme.backgroundColor},
            0 0 0 0.3em ${(p) => p.theme.calendar.hoverColor};
    }

    .react-calendar__tile--range:not(.react-calendar__tile--rangeStart):not(
            .react-calendar__tile--rangeStart
        ) {
        transition: all 1s ease !important;
        &::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            height: 3.15em;
            width: 6em;
            border-top: solid 0 0 0 0.3em
                ${(p) => p.theme.calendar.backgroundColor} 0.15em;
            border-bottom: solid ${(p) => p.theme.calendar.backgroundColor}
                0.15em;
        }
    }

    .react-calendar__tile--rangeStart:not(.react-calendar__tile--rangeEnd) {
        &::after {
            content: "";
            position: absolute;
            top: 50%;
            left: -0.3em;
            transform: translate(0, -50%) !important;

            height: 3.15em;
            width: 4.5em;
            border-top: solid ${(p) => p.theme.calendar.backgroundColor} 0.15em;
            border-bottom: solid ${(p) => p.theme.calendar.backgroundColor}
                0.15em;
            border-left: solid ${(p) => p.theme.calendar.backgroundColor} 0.15em;
            border-top-left-radius: 5em;
            border-bottom-left-radius: 5em;
        }
    }

    .react-calendar__tile--rangeEnd:not(.react-calendar__tile--rangeStart) {
        &::after {
            content: "";
            position: absolute;
            top: 50%;
            left: -3.15em !important;
            transform: translate(0, -50%) !important;

            height: 3.15em;
            width: 4.5em;
            border-top: solid ${(p) => p.theme.calendar.backgroundColor} 0.15em;
            border-bottom: solid ${(p) => p.theme.calendar.backgroundColor}
                0.15em;
            border-right: solid ${(p) => p.theme.calendar.backgroundColor}
                0.15em;
            border-top-right-radius: 5em;
            border-bottom-right-radius: 5em;
        }
    }

    /* 네비게이션 월 스타일 적용 */
    .react-calendar__year-view__months__month {
        border-radius: 0.8em;
        padding: 0;
    }

    /* 네비게이션 현재 월 스타일 적용 */
    .react-calendar__tile--hasActive {
        background-color: ${(p) => p.theme.accentColor};
        abbr {
            color: ${(p) => p.theme.calendar.todayColor};
        }
    }

    /* 네비게이션 월 스타일 적용 */
    .react-calendar__year-view__months__month {
        flex: 0 0 calc(25% - 1em) !important;
        margin-inline-start: 0.5em !important;
        margin-inline-end: 0.5em !important;
        margin-block-end: 1em;
        font-size: 1em;
        font-weight: 600;
        color: ${(p) => p.theme.textColor};

        &:hover {
            background-color: ${(p) =>
                p.theme.calendar.backgroundColor} !important;
        }
    }

    .react-calendar__navigation__label {
        &:hover {
            background-color: ${(p) =>
                p.theme.calendar.backgroundColor} !important;
        }

        &:disabled {
            background-color: ${(p) => p.theme.backgroundColor};
            color: ${(p) => p.theme.textColor};
        }
    }
`

const TodayButton = styled.button`
    position: absolute;
    top: 1em;
    right: 7em;

    width: 5em;
    height: 2em;
    border: 0;
    border-radius: 0.5em;
    background-color: ${(p) => p.theme.accentColor};
    color: ${(p) => p.theme.calendar.todayColor};
    font-weight: bolder;

    display: flex;
    justify-content: center;
    align-items: center;
`

export default CommonCalendar
