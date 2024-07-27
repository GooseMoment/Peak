import { useNavigate } from "react-router-dom"

import { Menu, Calendar, PlusCircle, Bell, Users } from "feather-icons-react"
import { toast } from "react-toastify"
import styled from "styled-components"

const Navbar = ({openSidebar}) => {
    const navigate = useNavigate()

    const onClickTaskCreate = () => {
        toast.info("TaskCreate")
    }

    return <Frame>
        <Item key="sidebar" onClick={openSidebar}>
            <Menu />
        </Item>
        <Item key="today" onClick={() => navigate("/app/today")}>
            <Calendar />
        </Item>
        <Item key="taskCreate" onClick={onClickTaskCreate}>
            <PlusCircle />
        </Item>
        <Item key="notifications" onClick={() => navigate("/app/notifications")}>
            <Bell />
        </Item>
        <Item key="social" onClick={() => navigate("/app/social/following")}>
            <Users />
        </Item>
    </Frame>
}

const Frame = styled.nav`
    z-index: 97;

    position: fixed;    
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    justify-content: space-between;
    align-items: center;

    box-sizing: border-box;
    width: 100vw;
    padding: 1em 1.25em;
    padding-bottom: max(env(safe-area-inset-bottom, 1em), 1em);

    border-top-left-radius: 16px;
    border-top-right-radius: 16px;

    background-color: ${p => p.theme.navbar.backgroundColor};
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
`

const Item = styled.div`
    color: ${p => p.theme.textColor};
    background-color: ${p => p.theme.backgroundColor};
    
    box-sizing: border-box;
    aspect-ratio: 1/1;
    height: 3.5em;

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
