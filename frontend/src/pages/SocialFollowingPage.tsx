import { useState } from "react"
import { generatePath, useNavigate } from "react-router-dom"

import { styled } from "styled-components"

import CommonCalendar from "@components/common/CommonCalendar"
import DailyContainer from "@components/social/DailyContainer"
import SocialPageTitle from "@components/social/SocialPageTitle"
import StatContainer from "@components/social/StatContainer"
import DateBar from "@components/social/common/DateBar"

import { getCurrentUsername } from "@api/client"

import { useClientTimezone } from "@utils/clientSettings"
import useDateParamState from "@utils/useDateParamState"
import useScreenType, { ifMobile, ifTablet } from "@utils/useScreenType"

import { DateTime } from "luxon"

const SocialFollowingPage = () => {
    const { isMobile, isTablet } = useScreenType()
    const tz = useClientTimezone()
    const navigate = useNavigate()

    const me = getCurrentUsername()
    const [selectedUser, setSelectedUser] = useState(me!)
    const [date, setDate] = useDateParamState({
        navigate: (value: DateTime, fallback: boolean) => {
            navigate(
                generatePath("/app/social/following/:date", {
                    date: value.toISODate(),
                }),
                {
                    replace: fallback,
                },
            )
        },
    })

    const setDateFromISO = (dateISO: string) =>
        setDate(DateTime.fromISO(dateISO, { zone: tz }))

    if (isMobile || isTablet) {
        return (
            <>
                <SocialPageTitle active="following" />
                <Wrapper>
                    <Container>
                        <DateBar date={date} setDate={setDate} />
                        <StatContainer date={date} />
                    </Container>
                </Wrapper>
            </>
        )
    }

    return (
        <>
            <SocialPageTitle active="following" />

            <Wrapper>
                <Container>
                    <CalendarWrapper>
                        <CommonCalendar
                            isRangeSelectMode={false}
                            selectedStartDate={date.toISO()}
                            setSelectedStartDate={setDateFromISO}
                            selectedEndDate={undefined}
                            setSelectedEndDate={undefined}
                            handleClose={undefined}
                        />
                    </CalendarWrapper>

                    <StatContainer
                        date={date}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                    />
                </Container>

                <StickyContainer>
                    <DailyContainer username={selectedUser} date={date} />
                </StickyContainer>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    width: 90%;

    display: flex;
    justify-content: space-between;

    ${ifTablet} {
        width: 100%;

        justify-content: center;
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

export default SocialFollowingPage
