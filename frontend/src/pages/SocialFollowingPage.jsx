import { useState } from "react"

import { useQuery } from "@tanstack/react-query"
import { styled } from "styled-components"

import CommonCalendar from "@components/common/CommonCalendar"
import SocialPageTitle from "@components/social/SocialPageTitle"
import DateBar from "@components/social/common/DateBar"
import LogDetails from "@components/social/logDetails/LogDetails"
import LogsPreview from "@components/social/logsPreview/LogsPreview"

import { getCurrentUsername } from "@api/client"
import { getDailyLogsPreview } from "@api/social.api"

import useScreenType, { ifMobile, ifTablet } from "@utils/useScreenType"

const SocialFollowingPage = () => {
    const initialDate = new Date()
    initialDate.setHours(0, 0, 0, 0)

    const { isMobile, isTablet } = useScreenType()

    const me = getCurrentUsername()

    const [selectedDate, setSelectedDate] = useState(initialDate.toISOString())
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
                    {(isMobile || isTablet) && (
                        <DateBar
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                        />
                    )}
                    {!(isMobile || isTablet) && (
                        <CalendarWrapper>
                            <CommonCalendar
                                isRangeSelectMode={false}
                                selectedStartDate={selectedDate}
                                setSelectedStartDate={setSelectedDate}
                                contentedDates={mockNewLogDates}
                            />
                        </CalendarWrapper>
                    )}

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
                {!(isMobile || isTablet) && (
                    <StickyContainer>
                        <LogDetails
                            username={targetUser}
                            selectedDate={selectedDate}
                        />
                    </StickyContainer>
                )}
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    width: 90%;

    display: flex;
    justify-content: space-between;

    ${ifMobile} {
        width: 100%;

        flex-direction: column;
    }
`

const Container = styled.div`
    width: 40%;
    min-width: 22.5rem;
    max-width: 28rem;
    margin-bottom: auto;

    padding: 0 1em 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;

    ${ifTablet} {
        padding: 0 0.5em 0;
    }

    ${ifMobile} {
        margin: 0;
        width: 100%;
        min-width: auto;

        padding: 0;
    }
`

const StickyContainer = styled(Container)`
    top: 2.5rem;
    margin-left: auto;
    gap: 0rem;
    position: sticky;
    flex-grow: 1;
    max-width: 30rem;
`

const CalendarWrapper = styled.div`
    margin: 0 auto;
    width: 100%;
    max-width: 35rem;

    ${ifMobile} {
        min-width: 20rem;

        font-size: 0.9em;
    }
`

const mockNewLogDates = [
    "2025-02-02T15:00:00.000Z",
    "2025-02-03T15:00:00.000Z",
    "2025-01-31T15:00:00.000Z",
]

export default SocialFollowingPage
