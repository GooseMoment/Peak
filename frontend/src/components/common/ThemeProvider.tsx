import { type ReactNode, useEffect, useState } from "react"

import { ThemeProvider } from "styled-components"
import { type LightDark } from "styled-components"

import { useClientTheme } from "@utils/clientSettings"

const metaThemeColor = document.head.querySelector("meta[name='theme-color']")

const ClientThemeProvider = ({ children }: { children: ReactNode }) => {
    const windowMatchMediaDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
    )
    const [systemTheme, setSystemTheme] = useState<LightDark>(
        windowMatchMediaDark?.matches ? "dark" : "light",
    )

    const theme = useClientTheme(systemTheme)

    const onChangeScheme = (e: MediaQueryListEvent) => {
        setSystemTheme(e.matches ? "dark" : "light")
    }

    useEffect(() => {
        windowMatchMediaDark.addEventListener("change", onChangeScheme)

        return () => {
            windowMatchMediaDark.removeEventListener("change", onChangeScheme)
        }
    }, [])

    useEffect(() => {
        document.body.style = `background-color: ${theme.backgroundColor}`
        metaThemeColor?.setAttribute("content", theme.backgroundColor)
    }, [theme])

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default ClientThemeProvider
