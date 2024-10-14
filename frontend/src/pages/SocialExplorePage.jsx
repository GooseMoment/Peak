import { useEffect, useState } from "react"

import { useInfiniteQuery } from "@tanstack/react-query"
import { styled } from "styled-components"

import { LoaderCircleFull } from "@components/common/LoaderCircle"
import SocialPageTitle from "@components/social/SocialPageTitle"
import ExploreFeed from "@components/social/explore/ExploreFeed"
import SearchBar from "@components/social/explore/SearchBar"
import LogDetails from "@components/social/logDetails/LogDetails"

import { getExploreFound, getExploreRecommend } from "@api/social.api"

import useScreenType, { ifMobile } from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

const getCursorFromURL = (url) => {
    if (!url) return null

    const u = new URL(url)
    const cursor = u.searchParams.get("cursor")
    return cursor
}

const SocialExplorePage = () => {
    const initial_date = new Date()
    initial_date.setHours(0, 0, 0, 0)
    const selectedDate = initial_date.toISOString()

    const isMobile = useScreenType().isMobile

    const [selectedUser, setSelectedUser] = useState(null)

    const {
        data: recommendPage,
        fetchNextPage: fetchNextRecommendPage,
        isPending: isRecommendPending,
        refetch: refetchRecommend,
    } = useInfiniteQuery({
        queryKey: ["explore", "recommend", "users"],
        queryFn: (page) => getExploreRecommend(page.pageParam),
        initialPageParam: "",
        getNextPageParam: (lastPage) => getCursorFromURL(lastPage.next),
        refetchOnWindowFocus: false,
    })

    const {
        data: foundPage,
        fetchNextPage: fetchNextFoundPage,
        isFetching: isFoundFetching,
        refetch: refetchFound,
    } = useInfiniteQuery({
        queryKey: ["explore", "found", "users"],
        queryFn: (page) => getExploreFound(searchQuery, page.pageParam),
        initialPageParam: "",
        getNextPageParam: (lastPage) => getCursorFromURL(lastPage.next),
        refetchOnWindowFocus: false,
        enabled: false,
    })

    // useRef로 대체??
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        if (searchQuery.length !== 0) refetchFound()
    }, [searchQuery])

    const handleSearch = (searchTerm) => {
        setSearchQuery(searchTerm.trim())
        queryClient.removeQueries(["explore", "found", "users"])
    }

    return (
        <>
            <SocialPageTitle active="explore" />
            <Wrapper>
                <Container>
                    <SearchBar handleSearch={handleSearch} />
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

                {!isMobile && <StickyContainer>
                    {selectedUser && (
                        <LogDetails
                            username={selectedUser}
                            selectedDate={selectedDate} //TOD temp
                            pageType="explore"
                        />
                    )}
                </StickyContainer>}
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
