import { useNavigate } from "react-router-dom"

import styled from "styled-components"

import { ifMobile } from "@utils/useScreenType"

import { Archive, Calendar, Home, Search, Users } from "feather-icons-react"

const Navbar = () => {
    const navigate = useNavigate()

    return (
        <Frame>
            <Box>
                <Item key="search" onClick={() => navigate("/app/search")}>
                    <Search />
                </Item>
                <Item key="today" onClick={() => navigate("/app/today")}>
                    <Calendar />
                </Item>
                <Item key="home" onClick={() => navigate("/app/home")}>
                    <Home />
                </Item>
                <Item key="projects" onClick={() => navigate("/app/projects")}>
                    <Archive />
                </Item>
                <Item
                    key="social"
                    onClick={() => navigate("/app/social/following")}>
                    <Users />
                </Item>
            </Box>
        </Frame>
    )
}

const Frame = styled.nav`
    z-index: 97;

    box-sizing: border-box;
    width: 100dvw;

    pointer-events: none;

    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;

    padding-left: max(env(safe-area-inset-left, 1em), 1em);
    padding-right: max(env(safe-area-inset-right, 1em), 1em);
    padding-bottom: max(env(safe-area-inset-bottom, 1em), 2em);

    justify-content: center;
    align-items: center;

    display: none;

    ${ifMobile} {
        display: flex;
    }
`

const Box = styled.div`
    display: flex;
    
    justify-content: center;
    align-items: center;
    gap: 0.5em;

    pointer-events: all;

    padding: 0.5em;

    border-radius: 32px;

    background-color: ${(p) => p.theme.navbar.backgroundColor};
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
`

const Item = styled.div`
    color: ${(p) => p.theme.textColor};

    box-sizing: border-box;
    aspect-ratio: 1/1;
    height: 2.5em;

    border-radius: 50%;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    & svg {
        font-size: 1.75em;
        stroke-width: 0.075em;

        top: 0;
        margin-right: unset;
    }
`

export default Navbar
