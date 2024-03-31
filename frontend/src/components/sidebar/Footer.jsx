import SidebarLink from "./SidebarLink"

import styled, { css } from "styled-components"
import FeatherIcon from "feather-icons-react"
import { useLocation } from "react-router-dom"

const Footer = ({user, collapsed}) => {
    const location = useLocation()

    return <FooterBox $collapsed={collapsed}>

        {user ? (
        <SidebarLink to={`users/@${user.username}`} draggable="false">
            <MeProfile>
                <img src={user.profile_img_uri} />
                {collapsed ? null : <Username>{user.username}</Username>}
            </MeProfile>
        </SidebarLink>
        ) : null }

        {collapsed ? null :
        <SidebarLink to="settings" draggable="false" state={{previous: location}}>
            <SettingIconContainer>
                <FeatherIcon icon="settings" />
            </SettingIconContainer>
        </SidebarLink> }

    </FooterBox>
}

const FooterBox = styled.footer`
display: flex;
flex-direction: ${props => props.collapsed ? "column" : "row"};
justify-content: space-between;

margin: 1em;

${({$collapsed}) => $collapsed ? css`
    margin: 0.75em;
` : null}
`

const MeProfile = styled.div`
display: flex;
flex-direction: row;
align-items: center;
gap: 0.5em;

padding: 0.5em;
background-color: inherit;
border-radius: 10px;

& img {
    border-radius: 50%;
    width: 2em;
    height: 2em;
}
`

const Username = styled.span`
font-weight: 500;
`

const SettingIconContainer = styled.div`
display: flex;
align-items: center;
justify-content: center;

padding: 0.5em;
margin: 0.35em;

width: auto;

& svg {
    margin-right: 0;
    width: auto;
    height: 1.25em;
}
`

export default Footer