import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
//import "./CommonCalendar.css";
import moment from 'moment';
import styled from "styled-components"

const CommonCalendar = ({ isSelectingRange, selectedStartDate, setSelectedStartDate, selectedEndDate, setSelectedEndDate }) => {

  const changeDate = (e) => {
    if(isSelectingRange) {
      const startDate = moment(e[0]).format("YYYY-MM-DD")
      const endDate = moment(e[0]).format("YYYY-MM-DD")
      setSelectedStartDate(startDate);
      setSelectedEndDate(endDate);
    }
    else {
      const startDate = moment(e).format("YYYY-MM-DD")
      setSelectedStartDate(startDate);
    }
  }

  // const setTileClassName = ({ date }) => {
  //   if(date.getDay)
  // }  

  return <CalendarWrapper>
    <StyledCalendar
      selectRange={isSelectingRange}
      onChange={changeDate}
      // value={selectedStartDate}
      formatDay={(locale, date) => moment(date).format("D")}
      locale='en'
      // tileClassName={}
      next2Label={null}
      prev2Label={null}
    />
  </CalendarWrapper>
};

const CalendarWrapper = styled.div`
  display: flex;

  .react-calendar {
    width: 100%;
    max-width: 100%;
    background: inherit;
    border: 0;
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
    line-height: 1.75em;
  }

  /* 전체 폰트 컬러 */
  .react-calendar__month-view {
    abbr {
      color: #000000;
    }
  }

  /* 네비게이션 가운데 정렬 */
  .react-calendar__navigation {
    justify-content: center;
  }

  /* 네비게이션 폰트 설정 */
  .react-calendar__navigation button {
    font-weight: 600;
    font-size: 1em;
  }

  /* 네비게이션 버튼 컬러 */
  .react-calendar__navigation button:focus {
    background-color: white;
  }

  /* 네비게이션 비활성화 됐을때 스타일 */
  .react-calendar__navigation button:disabled {
    background-color: white;
    color: ${(props) => props.theme.darkBlack};
  }

  /* 년/월 상단 네비게이션 칸 크기 줄이기 */
  .react-calendar__navigation__label {
    flex-grow: 0 !important;
  }

  /* 요일 밑줄 제거 */
  .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
    font-weight: 800;
  }

  /* 일요일에만 빨간 폰트 */
  .react-calendar__month-view__weekdays__weekday--weekend abbr[title="SUNDAY"] {
    color: red;
  }

  /* 오늘 날짜 폰트 컬러 */
  .react-calendar__tile--now {
    background: none;
    abbr {
      color: black;
    }
  }

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

  /* 일 날짜 간격 */
  .react-calendar__tile {
    padding: 5px 0px 18px;
    position: relative;
  }

  /* 네비게이션 월 스타일 적용 */
  .react-calendar__year-view__months__month {
    flex: 0 0 calc(33.3333% - 10px) !important;
    margin-inline-start: 5px !important;
    margin-inline-end: 5px !important;
    margin-block-end: 10px;
    padding: 20px 6.6667px;
    font-size: 0.9rem;
    font-weight: 600;
    color: ${(props) => props.theme.gray_1};
  }

  /* 선택한 날짜 스타일 적용 */
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus,
  .react-calendar__tile--active {
    background-color: ${(props) => props.theme.yellow_2};
    border-radius: 0.3rem;
  }
`

const StyledCalendar = styled(Calendar)``

export default CommonCalendar;