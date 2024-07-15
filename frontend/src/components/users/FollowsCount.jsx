import { useState, useEffect } from "react"

import ModalPortal from "@components/common/ModalPortal"
import { FollowerList, FollowingList } from "@components/users/FollowList"

import styled from "styled-components"

const FollowsCount = ({user}) => {
    const [window, setWindow] = useState("")

    useEffect(() => {
        setWindow("")
    }, [user])

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
`

const Count = styled.span`
    font-weight: 700;
`

export default FollowsCount
