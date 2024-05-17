import { skeletonCSS } from "@/assets/skeleton"
import { Link } from "react-router-dom"
import styled, { css } from "styled-components"

const socialTypes = [
    "comment", "reaction", "follow", "follow_request", "follow_request_accepted", "peck",
]

const Content = ({type, payload, actionUser, skeleton=false}) => {
    let title = null
    let detail = null

    if (socialTypes.includes(type)) {
        const actionUserProfileURL = "/app/users/@" + actionUser?.username
        title = <ContentTitleLink to={actionUserProfileURL}>@{actionUser?.username}</ContentTitleLink>
    } else {
        title = ""
    }

    switch (type) {
        case "comment":
            detail = <ContentDetailLink to={`/app/projects/${payload.task?.project_id}`}>
                    "{payload.comment}"
                </ContentDetailLink>
            break
        case "reaction":
            if (payload.parent_type === "task") {
                detail = <ContentDetailLink to={`/app/projects/${payload.task?.project_id}`}>
                    {payload.task?.name}
                </ContentDetailLink>
                break
            }

            detail = <ContentDetailLink to={"/app/social/following/"}>
                    Daily Comment of {payload.daily_comment?.date}
                </ContentDetailLink>
            break
        case "peck":
            detail = <ContentDetailLink to={`/app/projects/${payload.task?.project_id}`}>
                    {payload.task?.name}
                </ContentDetailLink>
            break
        case "follow":
            detail = "follows you"
            break
        case "follow_request":
            detail = "wants to follow you"
            break
        case "follow_request_accepted":
            detail = "accepted follow request"
            break
        default:
            detail = ""
    }

    return <Container>
        <ContentTitle $skeleton={skeleton}>{title}</ContentTitle>            
        <ContentDetail $skeleton={skeleton}>{detail}</ContentDetail>
    </Container> 
}

const Container = styled.div`
    flex-grow: 20; 
    
    display: flex;
    flex-direction: column;
    gap: 1em;
    justify-content: center;
`

const ContentTitle = styled.h3`
    font-weight: bold;

    ${props => props.$skeleton && css`
        width: 140px;
        height: 1em;
        ${skeletonCSS} 
    `}
`

const ContentDetail = styled.p`
    ${props => props.$skeleton && css`
        width: 140px;
        height: 1em;
        ${skeletonCSS} 
    `}
`

const ContentTitleLink = styled(Link)`
    color: inherit;
    text-decoration: none;
`

const ContentDetailLink = styled(Link)`
    color: inherit; 
`

export default Content
