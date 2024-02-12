import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '/src/App.jsx'
import reset from 'styled-reset'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    ${reset}

    html {
        height: 100vh;
        width: 100vw;
    }
    
    #root {
        background-color: #FEFDFC;
        height: 100%;
    }

    body, textarea {
        font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif !important;
    }
`

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalStyle />
        <App />
    </React.StrictMode>,
)