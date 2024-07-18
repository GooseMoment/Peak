import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import mainRouter from '@routers/mainRouter'
import hashRouter from '@routers/hashRouter'
import GlobalStyle from '@assets/GlobalStyle'

import ClientThemeProvider from '@components/common/ThemeProvider'
import FullscreenLoader from '@components/common/FullscreenLoader'
import Loading from '@components/settings/Loading'

import { ClientSettingProvider, initClientSettings } from '@utils/clientSettings'

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from '@queries/queryClient'

import registerSW from '@/registerSW'
import i18n, { I18nSetLocale } from '@utils/i18n.js'

// initilize client-side settings
initClientSettings()


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ClientSettingProvider>
            <ClientThemeProvider>
                <GlobalStyle />
                <ToastContainer position="bottom-right" stacked hideProgressBar />
                <QueryClientProvider client={queryClient} >
                    <I18nSetLocale i18n={i18n} />

                    <Suspense fallback={<FullscreenLoader />}>
                        <RouterProvider router={mainRouter} />
                    </Suspense>

                    <Suspense fallback={<Loading />}>
                        <RouterProvider router={hashRouter} />
                    </Suspense>
                </QueryClientProvider>
            </ClientThemeProvider>
        </ClientSettingProvider>
    </React.StrictMode>,
)

registerSW()