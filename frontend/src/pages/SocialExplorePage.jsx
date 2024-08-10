import { useState } from "react"

import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { styled } from "styled-components"

import { LoaderCircleFull } from "@components/common/LoaderCircle"
import SocialPageTitle from "@components/social/SocialPageTitle"
import ExploreFeed from "@components/social/explore/ExploreFeed"
import SearchBar from "@components/social/explore/SearchBar"
import LogDetails from "@components/social/logDetails/LogDetails"

import {
    getDailyLogTasks,
    getExploreRecommend,
    getExploreFound,
    getQuote,
} from "@api/social.api"

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

    const [selectedUser, setSelectedUser] = useState(null)

    const {
        data: recommendPage,
        fetchNextPage: fetchNextRecommendPage,
        // isPending: isRecommendPending,
        refetch: refetchRecommend,
    } = useInfiniteQuery({
        queryKey: ["explore", "recommend", "users"],
        queryFn: (page) =>
            getExploreRecommend(page.pageParam),
        initialPageParam: "",
        getNextPageParam: (lastPage) => getCursorFromURL(lastPage.next),
        refetchOnWindowFocus: false
    })

    const { data: recommendUsers, isPending: isRecommendPending } = useQuery({
        queryKey: ["explore", "recommend", "users"],
        queryFn: () => getExploreRecommend(),
        staleTime: 1 * 60 * 60 * 1000,
    })

    const [searchTerm, setSearchTerm] = useState("")

    const {
        data: foundUsers,
        isFetching: isFoundFetching,
        refetch: refetchFound,
    } = useQuery({
        queryKey: ["explore", "found", "users"],
        queryFn: () => getExploreFound(searchTerm),
        enabled: false,
    })

    const { data: quote } = useQuery({
        queryKey: ["quote", selectedUser],
        queryFn: () => getQuote(selectedUser, initial_date.toISOString()),
        enabled: !!selectedUser,
    })

    const { data: exploreLogDetails } = useQuery({
        queryKey: ["explore", "log", "details", selectedUser],
        queryFn: () => 
            getDailyLogTasks(selectedUser, initial_date.toISOString()),
        enabled: !!selectedUser,
    })

    const handleSearch = () => {
        setSearchTerm((prev) => prev.trim())
        console.log(searchTerm.length)
        if (searchTerm.length !== 0) {
            refetchFound()
        } else {
            queryClient.setQueryData(["explore", "found", "users"], null)
        }
    }

    return (
        <>
            <SocialPageTitle active="explore" />
            <Wrapper>
                <Container>
                    <SearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleSearch={handleSearch}
                    />
                    {isRecommendPending || (searchTerm && isFoundFetching) ? (
                        <LoaderCircleWrapper>
                            <LoaderCircleFull />
                        </LoaderCircleWrapper>
                    ) : (
                        <ExploreFeed
                            recommendUsers={recommendUsers}
                            recommendPage={recommendPage}
                            foundUsers={foundUsers}
                            selectedUser={selectedUser}
                            setSelectedUser={setSelectedUser}
                        />
                    )}
                </Container>

                <StickyContainer>
                    {quote && (
                        <LogDetails
                            user={quote?.user}
                            quote={quote}
                            logDetails={exploreLogDetails}
                            isFollowing={false}
                        />
                    )}
                </StickyContainer>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    display: flex;
    gap: 2rem;
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
