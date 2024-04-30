import { css, keyframes } from "styled-components"

const shineLines = keyframes`
    0% {
        background-position: -100px
    }
    40%, 100% {
        background-position: 140px
    }
`

export const skeletonCSS = css`
    background-image: linear-gradient(90deg, #ddd 0px, #e8e8e8 40px, #ddd 80px) ;
    background-size: 600px;

    animation: ${shineLines} 1.6s infinite linear;
`
