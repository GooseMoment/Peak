import ListUserProfile from "@components/users/ListUserProfile"
import { getFollowersByUser, getFollowingsByUser } from "@api/social.api"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"
import { Trans, useTranslation } from "react-i18next"

export const FollowerList = ({user}) => {
    const { t } = useTranslation(null, {keyPrefix: "users"})

    const { data: followers, isPending } = useQuery({
        queryKey: ["users", user.username, "followers"],
        queryFn: () => getFollowersByUser(user.username),
    })

    return <Window>
        <Title><Trans t={t} i18nKey="follower_list_title" values={{username: user?.username}} /></Title>
        <List>
            {isPending && [...Array(10)].map((_, i) => <ListUserProfile key={i} skeleton />)}
            {followers?.map(follower => <ListUserProfile user={follower} key={follower.username} />)}
            {followers?.length === 0 && <NoneMessage>{t("following_list_empty")}</NoneMessage>}
        </List>
    </Window>
}

export const FollowingList = ({user}) => {
    const { t } = useTranslation(null, {keyPrefix: "users"})

    const { data: followings, isPending } = useQuery({
        queryKey: ["users", user.username, "followings"],
        queryFn: () => getFollowingsByUser(user.username),
    })

    return <Window>
        <Title><Trans t={t} i18nKey="following_list_title" values={{username: user?.username}} /></Title>
        <List>
            {isPending && [...Array(10)].map((_, i) => <ListUserProfile key={i} skeleton />)}
            {followings?.map(following => <ListUserProfile user={following} key={following.username} />)}
            {followings?.length === 0 && <NoneMessage>{t("following_list_empty")}</NoneMessage>}
        </List>
    </Window>
}

const Window = styled.div`
    background-color: ${p => p.theme.backgroundColor};
    color: ${p => p.theme.textColor};
    width: 25rem;

    box-sizing: border-box;
    padding: 1.5em;
    border-radius: 16px;
`

const Title = styled.h2`
    font-weight: 700;
    margin-bottom: 1em;
`

const List = styled.div`
    position: relative;

    max-height: 70vh;
    overflow-y: auto;
`

const NoneMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    box-sizing: border-box;
    width: 100%;
    height: 10em;
`
