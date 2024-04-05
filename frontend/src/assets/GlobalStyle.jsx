import reset from 'styled-reset'

import { scaleForward, scaleBack, modalFadeOut, scaleUp, modalFadeIn, cubicBeizer } from '@assets/keyframes'

import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
${reset}

html {
    height: 100vh;
    width: 100vw;

    scrollbar-color: var(--goose) transparent;
    scrollbar-width: thin;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

#root > div > main {
    transform: scale(1);

    background-color: #FEFDFC;
    height: 100%;

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
    height: 100vh;
    padding: 0.5em;

    z-index: 99;

    animation: ${modalFadeIn} 0.5s ${cubicBeizer} forwards !important;
}

body, textarea, input {
    font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif !important;
    padding: 0;
}

body {
    overflow-x: hidden;
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
`

export default GlobalStyle