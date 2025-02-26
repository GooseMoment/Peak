import ReactDOM from "react-dom/client"

import { QueryClientProvider } from "@tanstack/react-query"

import Root from "@containers/Root"

import ClientThemeProvider from "@components/common/ThemeProvider"

import {
    ClientSettingProvider,
    initClientSettings,
} from "@utils/clientSettings"
import i18n, { I18nSetLocale } from "@utils/i18n"

import queryClient from "@queries/queryClient"

import GlobalStyle from "@assets/GlobalStyle"

import registerSW from "@/registerSW"

// initilize client-side settings
initClientSettings()

ReactDOM.createRoot(document.getElementById("root")).render(
    <ClientSettingProvider>
        <ClientThemeProvider>
            <GlobalStyle />
            <QueryClientProvider client={queryClient}>
                <Root />
            </QueryClientProvider>
            <I18nSetLocale i18n={i18n} />
        </ClientThemeProvider>
    </ClientSettingProvider>,
)

registerSW()
