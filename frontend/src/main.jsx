import React from "react"
import ReactDOM from "react-dom/client"

import GlobalStyle from "@assets/GlobalStyle"

import ClientThemeProvider from "@components/common/ThemeProvider"

import {
    ClientSettingProvider,
    initClientSettings,
} from "@utils/clientSettings"

import { QueryClientProvider } from "@tanstack/react-query"
import queryClient from "@queries/queryClient"

import registerSW from "@/registerSW"
import i18n, { I18nSetLocale } from "@utils/i18n.js"
import Root from "@containers/Root"

// initilize client-side settings
initClientSettings()

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ClientSettingProvider>
            <ClientThemeProvider>
                <GlobalStyle />
                <QueryClientProvider client={queryClient}>
                    <Root />
                </QueryClientProvider>
                <I18nSetLocale i18n={i18n} />
            </ClientThemeProvider>
        </ClientSettingProvider>
    </React.StrictMode>,
)

registerSW()
