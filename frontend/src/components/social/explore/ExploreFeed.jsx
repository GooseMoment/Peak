import { useRef, useState } from "react"

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
        !foundPage || foundPage?.pages[0].results?.length <= 3

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

            {/* {(foundUsers && Object.values(foundUsers).length === 0) ? (
                <NoResult>
                    No Result
                </NoResult>
            ):null} */}
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
