import { keyframes } from "styled-components"

// from: https://codepen.io/designcouch/pen/obvKxm

export const cubicBeizer = "cubic-bezier(0.165, 0.840, 0.440, 1.000)"

export const scaleUp = keyframes`
    0% {
        transform: scale(0.8) translateY(500px);
        opacity: 0;
    }

    100% {
        transform: scale(1) translateY(0px);
        opacity: 1;
    }
`

export const scaleDown = keyframes`
    0% {
        transform: scale(1) translateY(0px);
        opacity: 1;
    }

    100% {
        transform: scale(0.8) translateY(500px);
        opacity: 0;
    }
`

export const rotateToUp = keyframes`
    0% {
        transform: rotate(-180deg);
    }

    100% {
        transform: rotate(0deg);
    }
`

export const rotateToUnder = keyframes`
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(-180deg);
    }
`

export const dropdown = keyframes`
    0% {
        opacity: 60%;
        transform: translateY(-5px);
    }
    100% {
        opacity: 100%;
        transform: translateY(0);
    }
`

export const slideUp = keyframes`
    0% {
        opacity: 0;
        transform: translateY(100px);
    }

    100% {
        opacity: 1;
        transform: translateY(0px);
    }
`

export const slideDown = keyframes`
    0% {
        opacity: 1;
        transform: translateY(0px);
    }

    100% {
        opacity: 0;
        transform: translateY(100px);
    }
`

export const opacityUp = keyframes`
    0% {
        opacity: 0.6;
    }

    100% {
        opacity: 1;
    }
`
