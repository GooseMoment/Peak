import styled, { css } from "styled-components"

import { ifMobile } from "@utils/useScreenType"

const ProjectNameBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.8em 0em;

    ${(p) =>
        !p.$demo &&
        css`
            opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
            cursor: ${(props) => (props.$isInbox ? "auto" : "grab")};
        `}

    ${ifMobile} {
        flex-direction: column;
        align-items: flex-start;
    }
`

export default ProjectNameBox

export const NameBox = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6em;

    & svg {
        top: 0;
        width: 1.5em;
        height: 1.5em;
        margin-right: 0;
        stroke: none;
    }
`

export const NameText = styled.div`
    max-width: 10em;
    font-size: 1.25em;
    color: ${(p) => p.theme.textColor};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3em;
    user-select: none;

    &:hover {
        color: #ff4a03;
        cursor: pointer;
    }
`

export const TypeText = styled.div`
    color: ${(p) => p.theme.secondTextColor};
`
