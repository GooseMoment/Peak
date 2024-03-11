import styled from "styled-components";
import FeatherIcon from 'feather-icons-react';
import { useState } from "react";

function Drawer({drawer, children}){
    const [collapsed, setCollapsed] = useState(false);

    const handleCollapsed = () => {
        { drawer.task_count !== 0 && setCollapsed(prev => !prev)}
    }

    const DrawerIcons = [
        {icon: "plus", click: () => setIsModalOpen(true)},
        {icon: "more-horizontal", click: () => {}},
        {icon: "chevron-down", click: handleCollapsed},
    ]

    return (
        <>
            <DrawerBox $color = {drawer.color}>
                <DrawerName>{drawer.name}</DrawerName>
                <DrawerIcon>
                    {DrawerIcons.map(item => (
                        <FeatherIcon key={item.icon} icon={item.icon} onClick={item.click}/>
                    ))}
                </DrawerIcon>
            </DrawerBox>
            {collapsed ? null : children}
        </>
    );
}

const DrawerBox = styled.div`
    height: 3em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.5em;
    background-color: ${props => props.$color};
    border-radius: 17px 17px 0px 0px;
`

const DrawerName = styled.h1`
    font-size: 1.4em;
    font-weight: bold;
    text-align: left;
    margin-left: 1.45em;
    color: #FFFFFF;
    stroke: #000000;
    stroke-opacity: 0.2;
`

const DrawerIcon = styled.div`
    display: flex;
    align-items: center;
    margin-right: 1.45em;

    & svg {
        top: 0;
        margin-right: 1em;
        cursor: pointer;
    }
`

export default Drawer