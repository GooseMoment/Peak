import { css, keyframes } from "styled-components"

const shineLines = keyframes`
    0% {
        background-position: -100px
    }
    40%, 100% {
        background-position: 140px
    }
`

export const skeletonCSS = p => css`
    background-image: linear-gradient(
        90deg, 
        ${p => p.theme.skeleton.defaultColor} 0px, 
        ${p => p.theme.skeleton.shineColor} 40px, 
        ${p => p.theme.skeleton.defaultColor} 80px
    );
    background-size: 600px;

    animation: ${shineLines} 1.6s infinite linear;
`

const breathing = p => keyframes`
    0%, 100% {
        background-color: ${p.theme.skeleton.defaultColor};
    }
    40% {
        background-color: ${p.theme.skeleton.shineColor};
    }
`

export const skeletonBreathingCSS = css`
    background-color: ${p => p.theme.skeleton.defaultColor};
    animation: ${p => breathing(p)} 2s infinite linear;
`
