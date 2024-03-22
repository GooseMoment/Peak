import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import axios_config_defaults from '@api/config_defaults'

import router from '@/router'

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

#modal {
    opacity: 0%;

    transition: opacity 0.1s ease-in-out;
}

/* modal이 자손을 가질 때만 */
#modal:has(div) {
    opacity: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;

    background-color: rgba(0, 0, 0, 0.7);
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    padding: 0.5em;

    z-index: 99;
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
`

axios_config_defaults()

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalStyle />
        <RouterProvider router={router} />
    </React.StrictMode>,
)