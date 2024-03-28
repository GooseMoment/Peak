import { keyframes } from "styled-components"

export const cubicBeizer = "cubic-bezier(0.165, 0.840, 0.440, 1.000)"

export const scaleUp = keyframes`
    0% {
        transform: scale(0.8) translateY(1000px);
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
        transform: scale(0.8) translateY(1000px);
        opacity: 0;
    }
`

export const scaleBack = keyframes`
    0% {
        transform: scale(1);
    }

    100% {
        transform: scale(.95);
    }
`

export const scaleForward = keyframes`
    0% {
        transform: scale(.95);
    }

    100% {
        transform: scale(1);
    }
`


export const modalFadeIn = keyframes`
    0% {
        opacity: 0%;
        background-color: unset;
    }

    100% {
        opacity: 100%;
        background-color: rgba(0, 0, 0, 0.4);
    }
`

export const modalFadeOut = keyframes`
    0% {
        opacity: 100%;
        background-color: rgba(0, 0, 0, 0.4);

        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0.5em;

        z-index: 99;
    }

    100% {
        opacity: 0%;
        background-color: unset;

        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0.5em;

        z-index: 99;
    }
`
