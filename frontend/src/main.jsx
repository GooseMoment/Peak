import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import router from '@/router'

import GlobalStyle from '@assets/GlobalStyle'
import { defaultTheme } from "@assets/themes"
import { ThemeProvider } from "styled-components"

import { initClientSettings } from '@utils/clientSettings'

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// initilize client-side settings
initClientSettings()

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={defaultTheme}>
            <GlobalStyle />
            <ToastContainer position="bottom-right" stacked hideProgressBar />
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>,
)