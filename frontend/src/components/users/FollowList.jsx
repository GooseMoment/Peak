import ListUserProfile from "@components/users/ListUserProfile"
import { getFollowersByUser, getFollowingsByUser } from "@api/social.api"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

export const FollowerList = ({user}) => {
    const { data: followers, isPending } = useQuery({
        queryKey: ["users", user.username, "followers"],
        queryFn: () => getFollowersByUser(user.username),
    })

    return <Window>
        <Title>Users who follows @{user.username}</Title>
        {isPending && "Loading"}
        <List>
            {followers?.map(follower => <ListUserProfile user={follower} key={follower.username} />)}
        </List>
    </Window>
}

export const FollowingList = ({user}) => {
    const { data: followings, isPending } = useQuery({
        queryKey: ["users", user.username, "followings"],
        queryFn: () => getFollowingsByUser(user.username),
    })

    return <Window>
        <Title>Users who @{user.username} follows</Title>
        {isPending && "Loading"}
        <List>
            {followings?.map(following => <ListUserProfile user={following} key={following.username} />)}
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
    max-height: 70vh;
    overflow-y: auto;
`
