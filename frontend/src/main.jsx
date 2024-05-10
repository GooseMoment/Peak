import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import router from '@/router'
import hashRouter from '@/hashRouter'
import GlobalStyle from '@assets/GlobalStyle'
import { defaultTheme } from "@assets/themes"
import { ThemeProvider } from "styled-components"

import { ClientSettingProvider, initClientSettings } from '@utils/clientSettings'

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from '@queries/queryClient'

// initilize client-side settings
initClientSettings()

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={defaultTheme}>
            <GlobalStyle />
            <ToastContainer position="bottom-right" stacked hideProgressBar />
            <QueryClientProvider client={queryClient} >
                <ClientSettingProvider>
                    <RouterProvider router={router} />
                    <RouterProvider router={hashRouter} />
                </ClientSettingProvider>
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>,
)