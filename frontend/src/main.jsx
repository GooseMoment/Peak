import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import router from "@/router"
import hashRouter from "@/hashRouter"
import GlobalStyle from "@assets/GlobalStyle"

import Loading from "@components/settings/Loading"
import ClientThemeProvider from "@components/common/ThemeProvider"

import { ClientSettingProvider, initClientSettings } from "@utils/clientSettings"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { QueryClientProvider } from "@tanstack/react-query"
import queryClient from "@queries/queryClient"

import registerSW from "@/registerSW"
import i18n, { I18nSetLocale } from "@utils/i18n.js"

// initilize client-side settings
initClientSettings()


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ClientSettingProvider>
            <ClientThemeProvider>
                <GlobalStyle />
                <ToastContainer position="bottom-right" stacked hideProgressBar />
                <QueryClientProvider client={queryClient} >
                    <I18nSetLocale i18n={i18n} />

                    <Suspense fallback={<Loading />}>
                        <RouterProvider router={router} />
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
