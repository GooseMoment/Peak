import {
    scaleForward,
    scaleBack,
    modalFadeOut,
    modalFadeIn,
    cubicBeizer,
} from "@assets/keyframes"
import { ifMobile } from "@utils/useScreenType"

import { createGlobalStyle } from "styled-components"
import reset from "styled-reset"

const GlobalStyle = createGlobalStyle`
${reset}

html {
    height: 100dvh;
    width: 100vw;

    accent-color: ${(p) => p.theme.accentColor};
    scrollbar-color: ${(p) => p.theme.scrollbarColor} transparent;
    scrollbar-width: thin;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

#root > div > main {
    transform: scale(1);

    animation: ${scaleForward} .5s ${cubicBeizer} forwards;
}

#root.has-modal > div > main {
    transform: scale(0.95);
    animation: ${scaleBack} .5s ${cubicBeizer} forwards;
}

#modal {
    opacity: 0%;
}

#modal.with-animation {
    animation: ${modalFadeOut} 0.5s ${cubicBeizer};
}

/* modal이 자손을 가질 때만 */
#modal:has(div) {
    opacity: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;

    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 100dvh;
    padding: 0.5em;

    z-index: 99;

    animation: ${modalFadeIn} 0.5s ${cubicBeizer} forwards !important;
}

#confirmation {
    transition: background-color 1s ${cubicBeizer}
}

#confirmation:has(div) {
    position: fixed;
    top: 0;
    left: 0;

    z-index: 100;

    display: flex;
    justify-content: center;
    align-items: center;

    box-sizing: border-box;
    width: 100dvw;
    height: 100dvh;

    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(1px);
    -webkit-backdrop-filter: blur(1px);
}

a {
    color: inherit;
    text-decoration: none;
}

body, textarea, input, button {
    font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif !important;
    padding: 0;
}

textarea, input {
    color: inherit;
    background-color: inherit;
    border: none;
    
    &:focus {
        outline: none;
    }
}

body {
    overflow-x: hidden;
    transition: background-color 0.25s ${cubicBeizer};
}

.feather {
    position: relative;
    top: .13em;
    width: 1em;
    height: 1em;
    margin-right: .5em;
    display: inline-block;
    vertical-align: auto;
}

:root {
    --toastify-font-family: inherit;
}

.reactEasyCrop_Container {
    position: fixed !important;
    z-index: 999;
}

.Toastify__toast-body {
    line-height: 1.3;
}

${ifMobile} {
    body { // https://stackoverflow.com/a/3428477
        -webkit-text-size-adjust: 100%;
    }

    .Toastify__toast-body {
        font-size: 0.9em;
    }

    .Toastify__toast--stacked[data-pos="bot"] {
        bottom: 5em;
    }
}
`

export default GlobalStyle
