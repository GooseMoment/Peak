import reset from 'styled-reset'
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

#root {
    background-color: #FEFDFC;
    height: 100%;
}

@keyframes modalFadeIn {
    0% {
        opacity: 0%;
        backdrop-filter: unset;
        background-color: unset;
    }

    100% {
        opacity: 100%;
        backdrop-filter: blur(1.5px);
        background-color: rgba(0, 0, 0, 0.4);
    }
}

@keyframes modalFadeOut {
    0% {
        opacity: 100%;
        backdrop-filter: blur(1.5px);
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
        backdrop-filter: unset;
        background-color: unset;

        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0.5em;

        z-index: 99;
    }
}

#modal {
    opacity: 0%;
}

#modal.blank {
    animation: modalFadeOut 0.15s ease-out;
}

/* modal이 자손을 가질 때만 */
#modal:has(div) {
    opacity: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;

    backdrop-filter: blur(1.5px);
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    padding: 0.5em;

    z-index: 99;

    animation: modalFadeIn 0.15s ease-in-out;
}

body, textarea {
    font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif !important;
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