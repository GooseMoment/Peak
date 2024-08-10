import { useState } from "react"

import { useQuery } from "@tanstack/react-query"
import { css, styled } from "styled-components"

import SocialPageTitle from "@components/social/SocialPageTitle"
import LogDetails from "@components/social/logDetails/LogDetails"
import LogPreviewBox from "@components/social/logsPreview/LogPreviewBox"

import { getDailyLogDetails, getExploreFeed, getQuote } from "@api/social.api"

const SocialExplorePage = () => {
    const initial_date = new Date()
    initial_date.setHours(0, 0, 0, 0)

    const [selectedUser, setSelectedUser] = useState(null)

    const { data: recommendUsers } = useQuery({
        queryKey: ["explore", "recommend", "users"],
        queryFn: () => getExploreFeed(),
        staleTime: 3 * 60 * 60 * 1000,
    })

    const { data: quote } = useQuery({
        queryKey: ["quote", selectedUser],
        queryFn: () => getQuote(selectedUser, initial_date.toISOString()),
        enabled: !!selectedUser,
    })

    const { data: exploreLogDetails } = useQuery({
        queryKey: ["explore", "log", "details", selectedUser],
        queryFn: () =>
            getDailyLogDetails(selectedUser, initial_date.toISOString()),
        enabled: !!selectedUser,
    })

    return (
        <>
            <SocialPageTitle active="explore" />

            <Wrapper>
                <Container>
                    <DailyLogsPreviewContainer>
                        {recommendUsers &&
                            Object.values(recommendUsers).map(
                                (dailyFollowerLog, index) => (
                                    <LogPreviewBox
                                        key={index}
                                        log={dailyFollowerLog}
                                        selectedUser={selectedUser}
                                        setSelectedUser={setSelectedUser}
                                    />
                                ),
                            )}
                    </DailyLogsPreviewContainer>
                </Container>

                <Container $isSticky={true}>
                    {quote && (
                        <LogDetails
                            user={quote?.user}
                            quote={quote}
                            logDetails={exploreLogDetails}
                            isFollowing={false}
                        />
                    )}
                </Container>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    display: flex;
    gap: 5rem;
`

const Container = styled.div`
    width: 50%;
    min-width: 27.5rem;
    ${(props) =>
        props.$isSticky
            ? css`
                  /* align-self: flex-start; */
                  position: sticky;
                  top: 2.5rem;
                  gap: 0rem;
              `
            : css`
                  gap: 1rem;
              `}
    margin-bottom: auto;

    padding: 0 1rem 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
`

const DailyLogsPreviewContainer = styled.div``

export default SocialExplorePage
