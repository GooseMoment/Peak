import { useInfiniteQuery } from "@tanstack/react-query"
import styled from "styled-components"

import Error from "@components/settings/Error"
import Section, { Description, Name, Value } from "@components/settings/Section"
import UnblockButton from "@components/settings/UnblockButton"
import ListUserProfile from "@components/users/ListUserProfile"

import { getBlocks } from "@api/users.api"

import { getPageFromURL } from "@utils/pagination"

import { ImpressionArea } from "@toss/impression-area"
import { useTranslation } from "react-i18next"

const Blocks = () => {
    const {
        data,
        isFetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
    } = useInfiniteQuery({
        queryKey: ["blocks"],
        queryFn: ({ pageParam }) => getBlocks(pageParam),
        refetchOnWindowFocus: false,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })
    const isEmpty = data?.pages[0]?.results?.length === 0

    const { t } = useTranslation("settings", { keyPrefix: "blocks" })

    if (isError) {
        return <Error />
    }

    return (
        <>
            <Section>
                <Name>{t("blockees.name")}</Name>
                <Description>{t("blockees.description")}</Description>
                <Value>
                    {isFetching &&
                        !isFetchingNextPage &&
                        [...Array(10)].map((_, i) => (
                            <ListUserProfile key={i} skeleton />
                        ))}
                    {isEmpty && <Message>{t("blockees.empty")}</Message>}
                    {data?.pages.map((group) =>
                        group.results.map((user) => (
                            <ListUserProfile user={user} key={user.username}>
                                <UnblockButton user={user} />
                            </ListUserProfile>
                        )),
                    )}
                    {hasNextPage && (
                        <ImpressionArea
                            onImpressionStart={() => fetchNextPage()}
                            timeThreshold={200}>
                            <ListUserProfile skeleton />
                        </ImpressionArea>
                    )}
                </Value>
            </Section>
        </>
    )
}

// TODO: Integrate with @components/users/FollowList.jsx
const Message = styled.div`
    color: ${(p) => p.theme.grey};

    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    aspect-ratio: 3/2;
`

export default Blocks
