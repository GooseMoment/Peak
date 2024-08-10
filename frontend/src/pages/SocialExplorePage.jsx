import { useState } from "react"

import { useMutation, useQuery } from "@tanstack/react-query"
import { styled } from "styled-components"

import SocialPageTitle from "@components/social/SocialPageTitle"
import SearchBar from "@components/social/explore/SearchBar"
import LogDetails from "@components/social/logDetails/LogDetails"
import LogPreviewBox from "@components/social/logsPreview/LogPreviewBox"

import {
    getDailyLogDetails,
    getExploreFeed,
    getExploreSearchResults,
    getQuote,
} from "@api/social.api"

import queryClient from "@queries/queryClient"

import { LoaderCircleFull } from "@/components/common/LoaderCircle"
import { toast } from "react-toastify"

const SocialExplorePage = () => {
    const initial_date = new Date()
    initial_date.setHours(0, 0, 0, 0)

    const [selectedUser, setSelectedUser] = useState(null)

    const { data: recommendUsers, isPending: isRecommendPending } = useQuery({
        queryKey: ["explore", "recommend", "users"],
        queryFn: () => getExploreFeed(),
        staleTime: 1 * 60 * 60 * 1000,
    })

    const recommendUsersMutation = useMutation({
        mutationFn: ({ searchTerm }) => {
            if (searchTerm === "") return getExploreFeed()
            return getExploreSearchResults(searchTerm)
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["explore", "recommend", "users"], data)
        },
        onError: (e) => {
            toast.error(e)
        },
    })

    const [searchTerm, setSearchTerm] = useState('')

    const { data: foundUsers, isFetching: isSearcFetching, refetch: refetchFound } = useQuery({
        queryKey: ["explore", "searched", "users"],
        queryFn: () => getExploreSearchResults(searchTerm),
        enabled: false
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
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={refetchFound} />
                    <DailyLogsPreviewContainer>
                        {isRecommendPending || (searchTerm && isSearcFetching) ? (
                            <LoaderCircleWrapper>
                                <LoaderCircleFull />
                            </LoaderCircleWrapper>
                        ) : (
                            foundUsers && Object.values(foundUsers)?
                            Object.values(foundUsers).map(
                                (dailyFollowerLog) => (
                                    <LogPreviewBox
                                        key={dailyFollowerLog.username}
                                        log={dailyFollowerLog}
                                        selectedUser={selectedUser}
                                        setSelectedUser={setSelectedUser}
                                    />
                                ),
                            )
                            :
                            Object.values(recommendUsers).map(
                                (dailyFollowerLog) => (
                                    <LogPreviewBox
                                        key={dailyFollowerLog.username}
                                        log={dailyFollowerLog}
                                        selectedUser={selectedUser}
                                        setSelectedUser={setSelectedUser}
                                    />
                                ),
                            )
                        )}
                    </DailyLogsPreviewContainer>
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

const DailyLogsPreviewContainer = styled.div``

const LoaderCircleWrapper = styled.div`
    margin-top: 10em;
`

export default SocialExplorePage
