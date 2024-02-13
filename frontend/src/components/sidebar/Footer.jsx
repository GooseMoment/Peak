import SidebarLink from "./SidebarLink"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

const Footer = ({user}) => {
    return <FooterBox>
        {user ? (
        <CurrentUserProfile>
                <img src={user.profile_img_link} />
                <Username>{user.username}</Username>
        </CurrentUserProfile>) : null }
        <SidebarLink to="/settings/account">
            <FeatherIcon icon="settings" />
        </SidebarLink>
    </FooterBox>
}

const FooterBox = styled.footer`
display: flex;
flex-direction: row;
justify-content: space-between;

margin: 1em;
`

const CurrentUserProfile = styled.div`
display: flex;
flex-direction: row;
align-items: center;
gap: 0.5em;

& img {
    border-radius: 50%;
    width: auto;
    height: 2em;
}
`

const Username = styled.span`
font-weight: 500;
`

export default Footer