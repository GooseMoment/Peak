import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

const Box = ({notification}) => {
    return <BoxFrame>
        <BoxIcon smallIcon="🥳">
            <img src="https://avatars.githubusercontent.com/u/65756020?v=4" />
        </BoxIcon>
        <BoxTexts>
            <BoxTitle>@minyoy</BoxTitle>
            <BoxDetail>18:00 | memo here</BoxDetail>
        </BoxTexts>
        <div>
            <BoxAgo>3 minutes ago</BoxAgo>
            <FeatherIcon icon="more-horizontal" />
        </div>
    </BoxFrame>
}

const purifyNotificationForDisplay = (notification) => {
    let purified = {
        icon: null,
        title: "",
        detail: "",
        ago: "",
    }

    if (notification.type in ["reaction", "reaction_group", "follow", "follow_request", "follow_request_accepted", "peaked"]) {
        purified.title = "@" + notification.payload.user.username
        purified.icon = <BoxIcon><img src={notification.payload.user.profileImgURI} /></BoxIcon>
    }

    if (notification.type === "reaction") {
        purified.icon = <BoxIcon smallIcon={}></BoxIcon>
    }
    
    if (notification.type === "task") {
        purified.title = `Time to "${notification.payload.name}"`
    }

    if (notification.type === "trending_up") {
        purified.title = `More than ${notification.payload.than}`
    }

    return purified
}

const BoxFrame = styled.article`
display: flex;
gap: 1em;

border-bottom: 1px solid black;
padding: 1.5em 2em;
`

const BoxIcon = ({children, smallIcon}) => {
    return <BoxIconFrame>
        {children}
        {smallIcon ? <BoxIconSmall>
            <span>{smallIcon}</span>
        </BoxIconSmall> : null}
    </BoxIconFrame>
}

const BoxIconFrame = styled.div`
position: relative;
width: auto;
height: 3em;

& img {
    border-radius: 50%;
}

& svg {
    stroke: 2em;
}

& img, & svg {
    width: auto;
    height: 3em;
}
`

const BoxIconSmall = styled.div`
display: flex;
justify-content: center;
align-items: center;

position: absolute;
right: -2px;
bottom: -2px;

background-color: white;
box-sizing: border-box;
border-radius: 100%;

width: 1.25em;
height: 1.25em;

& span {
    vertical-align: -0.25em;
}
`

const BoxTexts = styled.div`
flex-grow: 999;
display: flex;
flex-direction: column;
gap: 0.5em;
justify-content: space-between;
`

const BoxTitle = styled.h3`
font-size: 1em;
font-weight: 600;
`

const BoxDetail = styled.p`
font-size: 1em;
font-weight: 400;
`

const BoxAgo = styled.time`
font-size: 0.5em;
`

export default Box