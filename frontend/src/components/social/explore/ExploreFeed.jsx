import styled from "styled-components"

import LogPreviewBox from "@components/social/logsPreview/LogPreviewBox"

import { ImpressionArea } from "@toss/impression-area"
import { useTranslation } from "react-i18next"

const ExploreFeed = ({
    recommendPage,
    foundPage,
    selectedUser,
    setSelectedUser,
    fetchNextFoundPage,
    fetchNextRecommendPage,
}) => {
    const { t } = useTranslation("", { keyPrefix: "social.explore" })

    const isRecommedNeeded =
        foundPage?.pages[0].results.length <= 3 || !foundPage

    const fetchNextFeed = () => {
        if (isRecommedNeeded) fetchNextRecommendPage()
        else fetchNextFoundPage()
    }

    return (
        <FeedContainer>
            {foundPage?.pages.map((group) =>
                group.results.map((feedUser) => (
                    <LogPreviewBox
                        key={feedUser.username}
                        log={feedUser}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        pageType="explore"
                    />
                )),
            )}

            {foundPage && foundPage.pages[0].results.length == 0 && (
                <NoResult>{t("no_result")}</NoResult>
            )}

            {isRecommedNeeded && <Suggestion>{t("suggestion")}</Suggestion>}

            {isRecommedNeeded &&
                recommendPage?.pages.map((group) =>
                    group.results.map((feedUser) => (
                        <LogPreviewBox
                            key={feedUser.username}
                            log={feedUser}
                            selectedUser={selectedUser}
                            setSelectedUser={setSelectedUser}
                            pageType="explore"
                        />
                    )),
                )}

            <ImpressionArea
                onImpressionStart={fetchNextFeed}
                timeThreshold={200}
            />
        </FeedContainer>
    )
}

const FeedContainer = styled.div``

const NoResult = styled.div`
    margin: 1em;

    display: flex;
    justify-content: center;
    align-items: center;
`

const Suggestion = styled.div`
    margin: 0.2em;

    padding: 0.5em;

    display: flex;
    justify-content: center;
    align-items: center;
`

export default ExploreFeed
