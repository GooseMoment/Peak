import { useRouteLoaderData } from "react-router-dom"

import Header from "./Header"
import Middle from "./Middle"
import Footer from "./Footer"

import styled, { css } from "styled-components"

const Sidebar = ({collapsed, setCollapsed}) => {
    const user = useRouteLoaderData("app")

    return <SidebarBox $collapsed={collapsed}>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Middle collapsed={collapsed} projects={mockProjects} />
        <Footer collapsed={collapsed} user={user} />
    </SidebarBox>
}

export const SidebarBox = styled.nav`
z-index: 99;

position: fixed;
height: 100vh;
width: 18rem;

display: flex;
flex-direction: column;
justify-content: space-between;

background-color: #F9F7F6;

${({$collapsed}) => $collapsed ? css`
    width: unset;
` : null}

& * {
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
}
`

const mockProjects = [
    {name: "Inbox", color: "#6E6E6E", type: "regular", privacy: "public", to: "projects/inbox"},
    {name: "홍대라이프", color: "#2E61DC", type: "regular", privacy: "public", to: "projects/홍대라이프"},
    {name: "홍대기숙사총장일", color: "#DC2E2E", type: "regular", privacy: "followers", to: "projects/홍대기숙사총장일"},
    {name: "장충동왕족발보쌈", color: "#D92EDC", type: "regular", privacy: "me", to: "projects/장충동왕족발보쌈"},
]

export default Sidebar