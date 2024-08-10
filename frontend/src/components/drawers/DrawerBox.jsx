import styled, { css } from "styled-components"

const DrawerBox = styled.div`
    height: 3em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.5em;
    text-decoration: double;
    border: solid 0.25em ${(props) => props.$color};
    border-radius: 15px;

    ${(p) =>
        p.$demo &&
        css`
            padding-left: 1em;
            padding-right: 1em;
        `}
`

export default DrawerBox

export const DrawerName = styled.h1`
    width: 42em;
    font-size: 1.4em;
    line-height: 1.2em;
    font-weight: bold;
    text-align: left;
    margin-left: 1.45em;
    color: ${(props) => props.$color};
    stroke-opacity: 0.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    ${(p) =>
        p.$demo &&
        css`
            width: unset;
            margin-left: unset;
        `}
`

export const DrawerIcon = styled.div`
    display: flex;
    align-items: center;
    margin-right: 1.45em;

    & svg {
        top: 0;
        margin-right: 1em;
        color: ${(props) => props.$color};
        cursor: pointer;
    }
`
