import styled from "styled-components"

import LogPreviewBox from "@components/social/logsPreview/LogPreviewBox"
import { useRef } from "react"

const ExploreFeed = ({
    recommendPage,
    recommendUsers,
    foundUsers,
    selectedUser,
    setSelectedUser,
}) => {

    const feedUsersList = () => {
        if(foundUsers && Object.values(foundUsers).length !== 0) return Object.values(foundUsers)
        return Object.values(recommendUsers)
    }

    return (
        <FeedContainer>
            {recommendPage?.pages?.map((group) => (
                group?.results?.map((user) => (
                    console.log(user)
                ))
            ))}

            {(foundUsers && Object.values(foundUsers).length === 0) ? (
                <NoResult>
                    No Result
                </NoResult>
            ):null}

            {
                feedUsersList().map((feedUser) => (
                    <LogPreviewBox
                        key={feedUser.username}
                        log={feedUser}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                    />
                ))
            }
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
