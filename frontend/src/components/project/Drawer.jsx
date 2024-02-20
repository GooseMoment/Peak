import styled from "styled-components";
import FeatherIcon from 'feather-icons-react';

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

function Drawer({name, color}){
    return (
        <DrawerBox $color = {color}>
            <DrawerName>{name}</DrawerName>
        </DrawerBox>
    );
}

export default Drawer