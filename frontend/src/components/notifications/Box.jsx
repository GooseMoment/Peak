import Images from "./Images"
import Content from "./Content"
import Ago from "./Ago"

import styled from "styled-components"

const Box = ({notification, skeleton=false}) => {
    const actionUser = notification?.reaction?.user || notification?.peck?.user || notification?.comment?.user 
        || (notification?.type === "follow" && notification?.following?.follower)
        || (notification?.type === "follow_request" && notification?.following?.follower)
        || (notification?.type === "follow_request_accepted" && notification?.following?.followee)

    const payload = notification?.reaction || notification?.peck || notification?.following || notification?.comment

    return <Frame>
        <Images skeleton={skeleton} profile_img={actionUser?.profile_img} reaction={notification?.reaction} />
        <Content skeleton={skeleton} payload={payload} type={notification?.type} actionUser={actionUser} />
        <Ago skeleton={skeleton} created_at={notification?.created_at} />
    </Frame>
}

const Frame = styled.article`
    box-sizing: border-box;
    
    display: flex;
    gap: 2.5em;

    min-width: 400px;
    height: 7em;
    padding: 1em;
    margin: 1em;
    margin-bottom: 2em;

    border-radius: 10px;

    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
`


export default Box
