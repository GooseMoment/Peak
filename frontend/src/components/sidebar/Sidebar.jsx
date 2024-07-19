import Header from "./Header"
import Middle from "./Middle"
import Footer from "./Footer"

import { getProjectList } from "@api/projects.api"
import { getMe } from "@api/users.api"

import styled, { css } from "styled-components"
import { useQuery } from "@tanstack/react-query"

const Sidebar = ({collapsed, setCollapsed}) => {
    const { data: user, isPending: userPending, isError: userError } = useQuery({
        queryKey: ["users", "me"],
        queryFn: () => getMe(),
    })

    const { data: projects, isPending: projectPending, isError: projectError } = useQuery({
        queryKey: ["projects"],
        queryFn: () => getProjectList(),
    })

    return <SidebarBox $collapsed={collapsed}>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Middle collapsed={collapsed} projects={projects} isPending={projectPending} isError={projectError} />
        <Footer collapsed={collapsed} user={user} isPending={userPending} isError={userError} />
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

    color: ${p => p.theme.textColor};
    background-color: ${p => p.theme.sidebar.backgroundColor};

    & * {
        user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
    }

    ${({$collapsed}) => $collapsed && css`
        width: unset;
    `}
`

export default Sidebar