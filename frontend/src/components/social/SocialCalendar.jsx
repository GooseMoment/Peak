import { useState } from "react"

import styled from "styled-components"

import CommonCalendar from "@components/common/CommonCalendar"

const SocialCalendar = ({ newLogDates, selectedDate, setSelectedDate }) => {
    const [tempDate, setTempDate] = useState(new Date())
    return (
        <StyledSocialCalendar
            isRangeSelectMode={false}
            selectedStartDate={selectedDate}
            setSelectedStartDate={setSelectedDate}
            selectedEndDate={tempDate}
            setSelectedEndDate={setTempDate}
            contentedDates={newLogDates}
        />
    )
}

const StyledSocialCalendar = styled(CommonCalendar)``

export default SocialCalendar
