import SidebarLink from "./SidebarLink"
import Middle from "./Middle"
import Footer from "./Footer"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

const Sidebar = ({hide, setHide}) => {

    return <SidebarBox hide={hide}>
                <div>LOGO HERE</div>
                <button onClick={() => setHide(previous => !previous)}>
                <FeatherIcon dominantBaseline="central" icon="chevrons-left" />
            </button>
        <Middle projects={mockProjects} />

        <Footer user={mockUser} />
    </SidebarBox>
}

const SidebarBox = styled.nav`
display: flex;
flex-direction: column;
justify-content: space-between;

background-color: #F9F7F6;
flex-basis: ${props => props.hide ? "0rem" : "18rem"};
transform: ${props => props.hide ? "translateX(-0%)" : "none"};
flex-grow: 1;

transition: transform 1s, flex-basis 1s;
transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);

& button {
    float: right;
}
`

const mockUser = {
    username: "minyoy",
    profile_img_link: "https://avatars.githubusercontent.com/u/65756020?v=4",
}

const mockProjects = [
    {name: "Inbox", color: "#6E6E6E", type: "regular", privacy: "public", to: "/projects/inbox"},
    {name: "홍대라이프", color: "#2E61DC", type: "regular", privacy: "public", to: "/projects/홍대라이프"},
    {name: "홍대기숙사총장일", color: "#DC2E2E", type: "regular", privacy: "followers", to: "/projects/홍대기숙사총장일"},
    {name: "장충동왕족발보쌈", color: "#D92EDC", type: "regular", privacy: "me", to: "/projects/장충동왕족발보쌈"},
]

export default Sidebar