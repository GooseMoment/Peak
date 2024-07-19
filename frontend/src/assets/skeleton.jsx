import { css, keyframes } from "styled-components"

const shineLines = (start, end) => keyframes`
    0% {
        background-position: ${start}
    }
    40%, 100% {
        background-position: ${end}
    }
`

export const skeletonCSS = (start="-100px", end="140px", interval="1.6s") => css`
    background-image: linear-gradient(
        90deg, 
        ${p => p.theme.skeleton.defaultColor} 0px, 
        ${p => p.theme.skeleton.shineColor} 40px, 
        ${p => p.theme.skeleton.defaultColor} 80px
    );
    background-size: 600px;

    animation: ${shineLines(start, end)} ${interval} infinite linear;
`
