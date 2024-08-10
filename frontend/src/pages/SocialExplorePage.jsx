import { useQuery } from "@tanstack/react-query"
import { css, styled } from "styled-components"

import SocialPageTitle from "@components/social/SocialPageTitle"
import LogPreviewBox from "@components/social/logsPreview/LogPreviewBox"

import { getExploreFeed } from "@api/social.api"

const SocialExplorePage = () => {
    const { data: recommendUsers } = useQuery({
        queryKey: ["explore", "recommend", "users"],
        queryFn: () => getExploreFeed(),
        staleTime: 3 * 60 * 60 * 1000,
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
                                    />
                                ),
                            )}
                    </DailyLogsPreviewContainer>
                </Container>

                <Container $isSticky={true}>
                    TEMP
                    {/* {dailyComment?<DailyLogDetail
                    dailyComment={dailyComment}
                    userLogDetails={dailyLogDetails}
                    userLogsDetail={mockDailyFollowerLogsDetail[0]}
                    user={user}
                    saveDailyComment={dailyCommentMutation.mutate}
                    day={selectedDate}
                />:null} */}
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
