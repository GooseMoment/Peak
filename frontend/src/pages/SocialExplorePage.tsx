import { useState } from "react"

import { styled } from "styled-components"

import DailyContainer from "@components/social/DailyContainer"
import SocialPageTitle from "@components/social/SocialPageTitle"
import ExploreFeed from "@components/social/explore/ExploreFeed"
import ExploreSearchBar from "@components/social/explore/ExploreSearchBar"

import type { User } from "@api/users.api"

import { useClientTimezone } from "@utils/clientSettings"
import useScreenType, { ifMobile, ifTablet } from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { DateTime } from "luxon"

const SocialExplorePage = () => {
    const tz = useClientTimezone()
    const [today] = useState(() =>
        DateTime.now()
            .setZone(tz)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
    )

    const { isTablet } = useScreenType()

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUser, setSelectedUser] = useState<User["username"]>()

    const handleSearch = (searchTerm: string) => {
        setSearchQuery(searchTerm.trim())
        queryClient.removeQueries({ queryKey: ["explore", "found", "users"] })
    }

    return (
        <>
            <SocialPageTitle active="explore" />
            <Wrapper>
                <Container>
                    <ExploreSearchBar handleSearch={handleSearch} />
                    <ExploreFeed
                        searchQuery={searchQuery}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                    />
                </Container>

                {!isTablet && (
                    <StickyContainer>
                        {selectedUser && (
                            <DailyContainer
                                username={selectedUser}
                                displayFollowButton
                                date={today}
                            />
                        )}
                    </StickyContainer>
                )}
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    display: flex;
    gap: 2rem;

    ${ifTablet} {
        /* flex-direction: column; */
        justify-content: center;
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
    /* align-self: flex-start; */
    top: 2.5rem;
    gap: 0rem;
`

export default SocialExplorePage
