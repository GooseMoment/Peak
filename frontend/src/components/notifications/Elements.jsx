import { cubicBeizer } from "@assets/keyframes"

import styled from "styled-components"

export const Frame = styled.article`
    display: flex;
    gap: 2em;

    border-bottom: 1px solid black;
    padding: 2em 2em;
`

export const Icon = ({children, smallIcon}) => {
    return <IconFrame>
        {children}
        {smallIcon ? <IconSmall>
            <span>{smallIcon}</span>
        </IconSmall> : null}
    </IconFrame>
}

export const IconFrame = styled.div`
    position: relative;
    width: auto;
    height: 3em;

    & svg {
        stroke: 2em;
        margin-right: 0;

        width: auto;
        height: 3em;
    }
`

export const ProfileImg = styled.img`
    width: 3em;
    height: 3em;
    border-radius: 50%;
`

export const IconSmall = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    right: -2px;
    bottom: -2px;

    background-color: white;
    box-sizing: border-box;

    width: 1.25em;
    height: 1.25em;

    & span {
        vertical-align: -0.25em;
    }

    & svg {
        transform: translateX(20%);
        width: 80%;
        height: 80%;
    }
`

export const IconSmallEmoji = styled.img`
    transform: translate(20%, 20%);

    width: 2.5em;
    height: auto;

    &:hover {
        transform: translate(20%, 20%) scale(1.3);
    }

    transition: transform 0.25s ${cubicBeizer};
`

export const Texts = styled.div`
    flex-grow: 999;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    justify-content: space-between;
`

export const TextsTitle = styled.h3`
    font-size: 1em;
    font-weight: 600;
`

export const TextsDetail = styled.p`
    font-size: 1em;
    font-weight: 400;
`

export const AgoAndMore = styled.div`
    display: flex;
    gap: 0.5em;

    font-size: 0.75em;
    color: grey;
`

export const Ago = styled.time``
