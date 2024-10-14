import { useState } from "react"

import { useQuery } from "@tanstack/react-query"
import { styled } from "styled-components"

import CommonCalendar from "@components/common/CommonCalendar"
import SocialPageTitle from "@components/social/SocialPageTitle"
import LogDetails from "@components/social/logDetails/LogDetails"
import LogsPreview from "@components/social/logsPreview/LogsPreview"

import { getCurrentUsername } from "@api/client"
import { getDailyLogsPreview } from "@api/social.api"

import useScreenType, { ifMobile } from "@utils/useScreenType"

const SocialFollowingPage = () => {
    const initial_date = new Date()
    initial_date.setHours(0, 0, 0, 0)

    const isMobile = useScreenType().isMobile

    const me = getCurrentUsername()

    const [selectedDate, setSelectedDate] = useState(initial_date.toISOString())
    const [selectedUser, setSelectedUser] = useState(null)

    const targetUser = selectedUser ? selectedUser : me

    const { data: dailyLogs } = useQuery({
        queryKey: ["daily", "logs", me, selectedDate],
        queryFn: () => getDailyLogsPreview(me, selectedDate),
        enabled: !!selectedDate && !!me,
    })

    return (
        <>
            <SocialPageTitle active="following" />

            <Wrapper>
                <Container>
                    <CalendarWrapper>
                        <CommonCalendar
                            isRangeSelectMode={false}
                            selectedStartDate={selectedDate}
                            setSelectedStartDate={setSelectedDate}
                            contentedDates={mockNewLogDates}
                        />
                    </CalendarWrapper>
                    {dailyLogs && (
                        <LogsPreview
                            logs={dailyLogs}
                            selectedUser={selectedUser}
                            setSelectedUser={setSelectedUser}
                            selectedDate={selectedDate}
                        />
                    )}
                </Container>

                {/* TODO: 날짜가 선택되지 않았을 때 */}
                <StickyContainer>
                        <LogDetails
                            username={targetUser}
                            selectedDate={selectedDate}
                        />
                    </StickyContainer>
                {/* {!isMobile && (
                    
                )} */}
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    display: flex;
    gap: 2rem;

    ${ifMobile} {
        flex-direction: column;
    }
`

const Container = styled.div`
    width: 50%;
    min-width: 27.5rem;
    margin-bottom: auto;

    padding: 0 1rem 0;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;

    ${ifMobile} {
        width: 100%;
        min-width: auto;

        padding: 0;
    }
`

const StickyContainer = styled(Container)`
    position: sticky;
    top: 2.5rem;
    gap: 0rem;
`

const CalendarWrapper = styled.div`
    margin: 0 auto;
    width: 80%;
    max-width: 35rem;

    ${ifMobile} {
        min-width: 20rem;

        font-size: 0.9em;
    }
`

const mockNewLogDates = [
    "2024-05-12T15:00:00.000Z",
    "2024-05-11T15:00:00.000Z",
    "2024-09-01T15:00:00.000Z",
]

export default SocialFollowingPage
