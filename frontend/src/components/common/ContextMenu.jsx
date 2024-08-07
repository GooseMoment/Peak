import { Fragment } from "react"

import styled from "styled-components"

import { dropdown } from "@assets/keyframes"

import FeatherIcon from "feather-icons-react"

const ContextMenu = ({ items, selectedButtonPosition }) => {
    return (
        <ContextMenuBox
            $top={selectedButtonPosition.top}
            $left={selectedButtonPosition.left}
        >
            {items.map((item, i) => (
                <Fragment key={item.icon}>
                    <DisplayBox $color={item.color} onClick={item.func}>
                        <FeatherIcon icon={item.icon} />
                        {item.display}
                    </DisplayBox>
                    {items.length - 1 === i || <CLine />}
                </Fragment>
            ))}
        </ContextMenuBox>
    )
}

const ContextMenuBox = styled.div`
    position: absolute;
    z-index: 2;
    display: flex;
    flex-direction: column;
    padding: 1em;
    width: 10em;
    height: auto;
    gap: 1em;

    top: ${(props) => props.$top + window.scrollY + 25}px;
    left: ${(props) => props.$left - 170}px;

    background-color: ${(p) => p.theme.backgroundColor};
    border: solid 2px ${(p) => p.theme.textColor};
    border-radius: 15px;
    cursor: pointer;

    animation: ${dropdown} 0.4s ease;
`

const DisplayBox = styled.div`
    display: flex;
    justify-content: flex-start;
    font-weight: normal;
    font-size: 1em;
    color: ${(props) => props.$color};

    & svg {
        top: 0;
    }
`

const CLine = styled.div`
    border-top: thin solid ${(p) => p.theme.project.clineColor};
    width: 100%;
`

export default ContextMenu
