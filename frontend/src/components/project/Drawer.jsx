import styled from "styled-components";
import FeatherIcon from 'feather-icons-react';

function Drawer({drawer, children}){
    return (
        <>
            <DrawerBox $color = {drawer.color}>
                <DrawerName>{drawer.name}</DrawerName>
                <DrawerIcon>
                    {DrawerIcons.map(item => (
                        <FeatherIcon key={item.icon} icon={item.icon} />
                    ))}
                </DrawerIcon>
            </DrawerBox>
            {children}
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
    }
`

const DrawerIcons = [
    {icon: "plus"},
    {icon: "more-horizontal"},
    {icon: "chevron-down"},
]

export default Drawer