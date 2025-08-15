import React from "react"
import ReactDOM from "react-dom/client"

import { QueryClientProvider } from "@tanstack/react-query"

import Root from "@containers/Root"

import ClientThemeProvider from "@components/common/ThemeProvider"

import {
    ClientSettingProvider,
    initClientSettings,
} from "@utils/clientSettings"
import i18n, { I18nSetLocale } from "@utils/i18n"
import { ScreenTypeProvider } from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import GlobalStyle from "@assets/GlobalStyle"

// initilize client-side settings
initClientSettings()

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ClientSettingProvider>
            <ClientThemeProvider>
                <GlobalStyle />
                <QueryClientProvider client={queryClient}>
                    <ScreenTypeProvider>
                        <Root />
                    </ScreenTypeProvider>
                </QueryClientProvider>
                <I18nSetLocale i18n={i18n} />
            </ClientThemeProvider>
        </ClientSettingProvider>
    </React.StrictMode>,
)
