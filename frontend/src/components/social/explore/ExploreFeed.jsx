import styled from "styled-components"

import LogPreviewBox from "@components/social/logsPreview/LogPreviewBox"

const ExploreFeed = ({
    recommendPage,
    foundPage,
    selectedUser,
    setSelectedUser,
    fetchNextFoundPage,
}) => {
    const isRecommedNeeded =
        foundPage?.pages[0].results.length <= 3 || !foundPage

    return (
        <FeedContainer>
            {foundPage?.pages.map((group) =>
                group.results.map((feedUser) => (
                    <LogPreviewBox
                        key={feedUser.username}
                        log={feedUser}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                    />
                )),
            )}

            {(foundPage && foundPage.pages[0].results.length==0) && 
                <NoResult>
                    No Result
                </NoResult>
            }

            <div>border</div>

            {isRecommedNeeded &&
                recommendPage?.pages.map((group) =>
                    group.results.map((feedUser) => (
                        <LogPreviewBox
                            key={feedUser.username}
                            log={feedUser}
                            selectedUser={selectedUser}
                            setSelectedUser={setSelectedUser}
                        />
                    )),
                )}

            <button onClick={() => fetchNextFoundPage()}>test</button>
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

export default ExploreFeed
