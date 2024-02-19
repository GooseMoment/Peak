import Header from "./Header"
import Middle from "./Middle"
import Footer from "./Footer"

import styled from "styled-components"

const Sidebar = ({collapsed, setCollapsed}) => {

    return <SidebarBox $collapsed={collapsed}>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Middle collapsed={collapsed} projects={mockProjects} />
        <Footer collapsed={collapsed} user={mockUser} />
    </SidebarBox>
}

const SidebarBox = styled.nav`
display: flex;
flex-direction: column;
justify-content: space-between;

background-color: #F9F7F6;
flex-basis: ${props => props.$collapsed ? "0rem" : "18rem"};
transform: ${props => props.$collapsed ? "translateX(-0%)" : "none"};
flex-grow: 1;

& * {
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
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