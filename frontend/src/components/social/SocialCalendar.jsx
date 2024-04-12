import styled from "styled-components"
import CommonCalendar from "@components/common/CommonCalendar";
import moment from 'moment';

import { useState } from "react";

const SocialCalendar = ({newLogDates, selectedDate, setSelectedDate}) => {
  const [tempDate, setTempDate] = useState(new Date())
  return <>
    <StyledSocialCalendar
      isSelectingRange={true}
      selectedStartDate={selectedDate}
      setSelectedStartDate={setSelectedDate}
      selectedEndDate={tempDate}
      setSelectedEndDate={setTempDate}
      contentedDates={newLogDates}
      // tileClassName={({ date, view }) => {
      //   if (newLogDates.find((x) => x === moment(date).format("YYYY-MM-DD"))) {
      //     return "highlight";
      //   }
      // }}
    />
  </>
};

// TODO: divide each calendar style
const StyledSocialCalendar = styled(CommonCalendar)``

export default SocialCalendar;