import { useEffect, useState } from "react"

import { useInfiniteQuery } from "@tanstack/react-query"
import { styled } from "styled-components"

import { LoaderCircleFull } from "@components/common/LoaderCircle"
import DailyContainer from "@components/social/DailyContainer"
import SocialPageTitle from "@components/social/SocialPageTitle"
import ExploreFeed from "@components/social/explore/ExploreFeed"
import ExploreSearchBar from "@components/social/explore/ExploreSearchBar"

import { getExploreFound, getExploreRecommend } from "@api/social.api"

import { useClientTimezone } from "@utils/clientSettings"
import { getCursorFromURL } from "@utils/pagination"
import useScreenType, { ifMobile } from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { DateTime } from "luxon"

const SocialExplorePage = () => {
    const tz = useClientTimezone()
    const [today] = useState(() =>
        DateTime.now()
            .setZone(tz)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
    )

    const { isMobile } = useScreenType()

    const [selectedUser, setSelectedUser] = useState(null)

    const {
        data: recommendPage,
        fetchNextPage: fetchNextRecommendPage,
        isPending: isRecommendPending,
    } = useInfiniteQuery({
        queryKey: ["explore", "recommend", "users"],
        queryFn: (page) => getExploreRecommend(page.pageParam),
        initialPageParam: "",
        getNextPageParam: (lastPage) => getCursorFromURL(lastPage.next),
        refetchOnWindowFocus: false,
    })

    // useRef로 대체??
    const [searchQuery, setSearchQuery] = useState("")

    const {
        data: foundPage,
        fetchNextPage: fetchNextFoundPage,
        isFetching: isFoundFetching,
        refetch: refetchFound,
    } = useInfiniteQuery({
        queryKey: ["explore", "found", "users", { searchQuery }],
        queryFn: (page) => getExploreFound(searchQuery, page.pageParam),
        initialPageParam: "",
        getNextPageParam: (lastPage) => getCursorFromURL(lastPage.next),
        refetchOnWindowFocus: false,
        enabled: false,
    })

    useEffect(() => {
        if (searchQuery.length !== 0) refetchFound()
    }, [searchQuery, refetchFound])

    const handleSearch = (searchTerm) => {
        setSearchQuery(searchTerm.trim())
        queryClient.removeQueries(["explore", "found", "users"])
    }

    return (
        <>
            <SocialPageTitle active="explore" />
            <Wrapper>
                <Container>
                    <ExploreSearchBar handleSearch={handleSearch} />
                    {isRecommendPending || (searchQuery && isFoundFetching) ? (
                        <LoaderCircleWrapper>
                            <LoaderCircleFull />
                        </LoaderCircleWrapper>
                    ) : (
                        <ExploreFeed
                            recommendPage={recommendPage}
                            fetchNextRecommendPage={fetchNextRecommendPage}
                            foundPage={foundPage}
                            fetchNextFoundPage={fetchNextFoundPage}
                            selectedUser={selectedUser}
                            setSelectedUser={setSelectedUser}
                        />
                    )}
                </Container>

                {!isMobile && (
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
    /* align-self: flex-start; */
    position: sticky;
    top: 2.5rem;
    gap: 0rem;
`

const LoaderCircleWrapper = styled.div`
    margin-top: 10em;
`

export default SocialExplorePage
