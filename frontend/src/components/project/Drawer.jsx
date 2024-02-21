import styled from "styled-components";
import FeatherIcon from 'feather-icons-react';

function Drawer({drawer, children}){
    return (
        <>
            <DrawerBox $color = {drawer.color}>
                <DrawerName>{drawer.name}</DrawerName>
            </DrawerBox>
            {children}
        </>
    );
}

const DrawerBox = styled.div`
    height: 3.5em;
    display: flex;
    align-items: center;
    margin-top: 1.5em;
    background-color: ${props => props.$color};
    border-radius: 17px 17px 0px 0px;
`

const DrawerName = styled.h1`
    font-size: 1.45em;
    font-weight: bold;
    text-align: left;
    padding-left: 1.45em;
    color: #FFFFFF;
    stroke: #000000;
    stroke-opacity: 0.2;
`

export default Drawer