import { useInfiniteQuery } from "@tanstack/react-query"
import styled from "styled-components"

import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import ListUserProfile from "@components/users/ListUserProfile"

import { getFollowersByUser, getFollowingsByUser } from "@api/social.api"

import { ifMobile } from "@utils/useScreenType"

import { ImpressionArea } from "@toss/impression-area"
import FeatherIcon from "feather-icons-react"
import { Trans, useTranslation } from "react-i18next"

const getPageFromURL = (url) => {
    if (!url) return null

    const u = new URL(url)
    const page = u.searchParams.get("page")
    return page
}

export const FollowerList = ({ user }) => {
    const { t } = useTranslation(null, { keyPrefix: "users" })

    const { closeModal } = useModalWindowCloseContext()

    const {
        data,
        isFetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
    } = useInfiniteQuery({
        queryKey: ["users", user.username, "followers"],
        queryFn: () => getFollowersByUser(user.username),
        initialPageParam: "",
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    return (
        <Window>
            <TitleBar>
                <Title>
                    <Trans
                        t={t}
                        i18nKey="follower_list_title"
                        values={{ username: user?.username }}
                    />
                </Title>
                <CloseButton onClick={closeModal}>
                    <FeatherIcon icon="x" />
                </CloseButton>
            </TitleBar>
            <List>
                {isFetching &&
                    !isFetchingNextPage &&
                    [...Array(10)].map((_, i) => (
                        <ListUserProfile key={i} skeleton />
                    ))}
                {isError && <Message>{t("follower_list_error")}</Message>}
                {data?.length === 0 && (
                    <Message>{t("follower_list_empty")}</Message>
                )}
                {data?.pages.map((group) =>
                    group.results.map((follower) => (
                        <ListUserProfile
                            user={follower}
                            key={follower.username}
                        />
                    )),
                )}
                <ImpressionArea
                    onImpressionStart={() => fetchNextPage()}
                    timeThreshold={200}>
                    {hasNextPage && <ListUserProfile skeleton />}
                </ImpressionArea>
            </List>
        </Window>
    )
}

export const FollowingList = ({ user }) => {
    const { t } = useTranslation(null, { keyPrefix: "users" })

    const { closeModal } = useModalWindowCloseContext()

    const {
        data,
        isFetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
    } = useInfiniteQuery({
        queryKey: ["users", user.username, "followings"],
        queryFn: () => getFollowingsByUser(user.username),
        initialPageParam: "",
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    return (
        <Window>
            <TitleBar>
                <Title>
                    <Trans
                        t={t}
                        i18nKey="following_list_title"
                        values={{ username: user?.username }}
                    />
                </Title>
                <CloseButton onClick={closeModal}>
                    <FeatherIcon icon="x" />
                </CloseButton>
            </TitleBar>
            <List>
                {isFetching &&
                    !isFetchingNextPage &&
                    [...Array(10)].map((_, i) => (
                        <ListUserProfile key={i} skeleton />
                    ))}
                {isError && <Message>{t("following_list_error")}</Message>}
                {data?.length === 0 && (
                    <Message>{t("following_list_empty")}</Message>
                )}
                {data?.pages.map((group) =>
                    group.results.map((following) => (
                        <ListUserProfile
                            user={following}
                            key={following.username}
                        />
                    )),
                )}
                <ImpressionArea
                    onImpressionStart={() => fetchNextPage()}
                    timeThreshold={200}>
                    {hasNextPage && <ListUserProfile skeleton />}
                </ImpressionArea>
            </List>
        </Window>
    )
}

const Window = styled.div`
    background-color: ${(p) => p.theme.backgroundColor};
    color: ${(p) => p.theme.textColor};
    width: 25rem;

    box-sizing: border-box;

    padding-top: max(env(safe-area-inset-top), 1.5em);
    padding-right: max(env(safe-area-inset-right), 1.5em);
    padding-bottom: max(env(safe-area-inset-bottom), 1.5em);
    padding-left: max(env(safe-area-inset-left), 1.5em);

    border-radius: 16px;

    ${ifMobile} {
        border-radius: 0;
        width: 100dvw;
        height: 100dvh;
    }
`

const TitleBar = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Title = styled.h2`
    font-weight: 700;
`

const CloseButton = styled.div`
    display: none;

    ${ifMobile} {
        display: block;
        cursor: pointer;
        padding: 1em;
    }

    & svg {
        top: 0;
        margin-right: 0;
    }
`

const List = styled.div`
    position: relative;

    max-height: 70dvh;
    overflow-y: auto;

    ${ifMobile} {
        max-height: 85dvh;
        overflow-y: scroll;
    }
`

const Message = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    box-sizing: border-box;
    width: 100%;
    height: 10em;
`
