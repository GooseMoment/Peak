import { useState, useEffect } from "react"

import ModalPortal from "@components/common/ModalPortal"
import { FollowerList, FollowingList } from "@components/users/FollowList"

import { skeletonCSS } from "@assets/skeleton"

import styled, { css } from "styled-components"

const FollowsCount = ({user, isPending}) => {
    const [window, setWindow] = useState("")

    useEffect(() => {
        setWindow("")
    }, [user])

    if (isPending) {
        return <Items>
            <Item>Followers <Count $skeleton /></Item>
            <Item>Followings <Count $skeleton /></Item>
        </Items>
    }

    return <Items>
        <Item onClick={() => setWindow("followers")}>Followers <Count>{user.followers_count}</Count></Item>
        <Item onClick={() => setWindow("followings")}>Followings <Count>{user.followings_count}</Count></Item>
        {window !== "" &&
            <ModalPortal closeModal={() => setWindow("")}>
                {window === "followers" && <FollowerList user={user} />} 
                {window === "followings" && <FollowingList user={user} />} 
            </ModalPortal>
        }
    </Items>
}

const Items = styled.div`
    display: flex;
    gap: 1em;
`

const Item = styled.div`
    cursor: pointer;

    display: flex;
    gap: 0.5em;
`

const Count = styled.span`
    font-weight: 700;

    ${p => p.$skeleton && css`
        height: 1em;
        width: 1.5em;
        ${skeletonCSS}
    `}
`

export default FollowsCount
