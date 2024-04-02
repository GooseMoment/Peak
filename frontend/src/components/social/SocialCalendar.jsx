import styled from "styled-components"
import CommonCalendar from "@components/common/CommonCalendar";
import moment from 'moment';

// TODO: divide each calendar style
const StyledSocialCalendar = styled(CommonCalendar)`
.highlight {
  background: #00ff00;
}
// .react-calendar__tile:enabled:hover,
// .react-calendar__tile:enabled:focus,
// .react-calendar__tile--active {
//       background: #a4a4a4;
//       border-radius: 14px;
//   } 
`

const SocialCalendar = ({newLogDates, selectedDate, setSelectedDate}) => {
  return <>
    <StyledSocialCalendar
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      tileClassName={({ date, view }) => {
        if (newLogDates.find((x) => x === moment(date).format("DD-MM-YYYY"))) {
          return "highlight";
        }
      }}
    />
  </>
};

export default SocialCalendar;