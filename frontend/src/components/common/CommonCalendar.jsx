import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import styled from "styled-components"

const CommonCalendar = ({ isSelectingRange, selectedStartDate, setSelectedStartDate, selectedEndDate, setSelectedEndDate }) => {

  const changeDate = (e) => {
    if(isSelectingRange) {
      const startDate = moment(e[0]).format("YYYY-MM-DD")
      const endDate = moment(e[1]).format("YYYY-MM-DD")
      setSelectedStartDate(startDate)
      setSelectedEndDate(endDate)
    }
    else {
      const startDate = moment(e).format("YYYY-MM-DD")
      if(selectedStartDate === startDate) {
        setSelectedStartDate(null)
      }
      else setSelectedStartDate(startDate)
    }
  }

  const setTileClassName = ({ date, view }) => {
    const classes = []

    if(view === 'month') {
      if(selectedStartDate && date === selectedStartDate)
        classes.push('selected')
    
      if(date.getDay() === 0)
        classes.push('sunday')

      if(date.getDay() === 6)
        classes.push('saturday')
    }
    return classes.length === 0 ? null : classes.join(' ')
  }

  return <CalendarWrapper>
    <StyledCalendar
      selectRange={isSelectingRange}
      onChange={changeDate}
      value={selectedStartDate}
      formatDay={(locale, date) => moment(date).format("D")}
      locale='en'
      // tileClassName={setTileClassName}
      next2Label={null}
      prev2Label={null}
    />
    {selectedStartDate}
  </CalendarWrapper>
};

const CalendarWrapper = styled.div`
  display: flex;

  .react-calendar {
    width: 100%;
    max-width: 100%;

    border: 0;
    background: inherit;
    
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
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
  }

  /* 네비게이션 버튼 컬러 */
  .react-calendar__navigation button:focus {
    background-color: white;
  }


  /* 요일 밑줄 제거 */
  .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
    font-weight: 800;
  }

  /* 요일 주말 폰트 */
  .react-calendar__month-view__weekdays__weekday--weekend abbr[title="Sunday"] {
    color: red;
  }
  .react-calendar__month-view__weekdays__weekday--weekend abbr[title="Saturday"] {
    color: blue;
  }

  /* 일 타일 */
  .react-calendar__month-view__days__day {
    flex-basis: 2.5em !important;
    margin: 0.4em calc((100% - 7*2.5em)/14) 0.4em !important;
    height: 2.5em;

    border-radius: 3em;
    padding: 0.1em !important;

    background-color: #D9D9D9;
  }

  /* 월 전체 */
  .react-calendar__month-view {
    /* 폰트 */
    abbr {
      color: #000000;
    }
  }
  /* 인접 월 */
  .react-calendar__month-view__days__day--neighboringMonth {
    background-color: #E6E6E6;
    /* 폰트 */
    abbr {
      color: #A4A4A4;
    }
  }

  /* 오늘 날짜 */
  .react-calendar__tile--now {
    background: #FF4A03;
    abbr {
      color: #ffffff;
    }
  }

  /* 선택한 날짜 스타일 적용 */
  /* .react-calendar__tile:enabled:hover,*/
  /* .react-calendar__tile:enabled:focus-visible, */
  .react-calendar__tile--active {
    box-shadow: 0 0 0 0.15em #FEFDFC, 0 0 0 0.3em #D9D9D9;
  }
  
  /* react-calendar__tile
  react-calendar__tile--now 
  react-calendar__tile--active 
  react-calendar__tile--range 
  react-calendar__tile--rangeStart 
  react-calendar__tile--rangeEnd 
  react-calendar__tile--rangeBothEnds
  react-calendar__month-view__days__day */

  /* 네비게이션 월 스타일 적용 */
  .react-calendar__year-view__months__month {
    border-radius: 0.8rem;
    background-color: ${(props) => props.theme.gray_5};
    padding: 0;
  }

  /* 네비게이션 현재 월 스타일 적용 */
  .react-calendar__tile--hasActive {
    background-color: ${(props) => props.theme.primary_2};
    abbr {
      color: white;
    }
  }

  /* 네비게이션 월 스타일 적용 */
  .react-calendar__year-view__months__month {
    flex: 0 0 calc(33.3333% - 10px) !important;
    margin-inline-start: 5px !important;
    margin-inline-end: 5px !important;
    margin-block-end: 10px;
    font-size: 1em;
    font-weight: 600;
    color: green;
  }
`

const StyledCalendar = styled(Calendar)``

export default CommonCalendar;