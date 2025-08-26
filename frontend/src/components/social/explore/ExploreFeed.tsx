import { Dispatch, SetStateAction } from "react"

import { useInfiniteQuery } from "@tanstack/react-query"
import styled from "styled-components"

import { LoaderCircleFull } from "@components/common/LoaderCircle"
import { StatBox } from "@components/social/StatContainer"

import { getExploreFound, getExploreRecommend } from "@api/social.api"
import type { User } from "@api/users.api"

import { getCursorFromURL } from "@utils/pagination"

import { ImpressionArea } from "@toss/impression-area"
import { useTranslation } from "react-i18next"

const ExploreFeed = ({
    searchQuery,
    selectedUser,
    setSelectedUser,
}: {
    searchQuery: string
    selectedUser: User["username"] | undefined
    setSelectedUser: Dispatch<SetStateAction<User["username"] | undefined>>
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "social.explore" })
    const isSearching = searchQuery.trim().length > 0

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
        enabled: !isSearching,
    })

    const {
        data: foundPage,
        fetchNextPage: fetchNextFoundPage,
        isFetching: fetchingFoundPage,
    } = useInfiniteQuery({
        queryKey: ["explore", "found", "users", { searchQuery }],
        queryFn: (page) => getExploreFound(searchQuery, page.pageParam),
        initialPageParam: "",
        getNextPageParam: (lastPage) => getCursorFromURL(lastPage.next),
        refetchOnWindowFocus: false,
        enabled: isSearching,
    })

    const fetchNextFeed = () => {
        if (!isSearching) fetchNextRecommendPage()
        else fetchNextFoundPage()
    }

    const users = foundPage?.pages?.flatMap?.((g) => g?.results ?? []) ?? []

    if (isRecommendPending) {
        return (
            <LoaderCircleWrapper>
                <LoaderCircleFull />
            </LoaderCircleWrapper>
        )
    }

    return (
        <FeedContainer>
            {isSearching && (
                <Suggestion>
                    {t("results_title", { query: searchQuery })}
                </Suggestion>
            )}

            {fetchingFoundPage ? (
                <LoaderCircleWrapper>
                    <LoaderCircleFull />
                </LoaderCircleWrapper>
            ) : isSearching && users.length === 0 ? (
                <NoResult>{t("no_result")}</NoResult>
            ) : (
                users.map((feedUser) => (
                    <StatBox
                        key={feedUser.username}
                        stat={feedUser}
                        isSelected={feedUser.username === selectedUser}
                        setSelectedUser={setSelectedUser}
                    />
                ))
            )}

            {!isSearching && <Suggestion>{t("suggestion")}</Suggestion>}
            {!isSearching &&
                recommendPage?.pages.map((group) =>
                    group.results.map((feedUser) => (
                        <StatBox
                            key={feedUser.username}
                            stat={feedUser}
                            isSelected={feedUser.username === selectedUser}
                            setSelectedUser={setSelectedUser}
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

const FeedContainer = styled.div`
    width: 100%;
    max-width: 30rem;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    column-gap: 1em;
    row-gap: 1em;
    padding-bottom: 1em;
`

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
    justify-content: left;
    align-items: center;
    flex-basis: 100%;
`

const LoaderCircleWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5em;
`

export default ExploreFeed
