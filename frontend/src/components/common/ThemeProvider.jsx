import { useEffect, useState } from "react"

import { ThemeProvider } from "styled-components"

import { useClientTheme } from "@utils/clientSettings"

const metaThemeColor = document.head.querySelector("meta[name='theme-color']")

const ClientThemeProvider = ({ children }) => {
    const windowMatchMediaDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
    )
    const [systemTheme, setSystemTheme] = useState(
        window.matchMedia && windowMatchMediaDark.matches ? "dark" : "light",
    )

    const theme = useClientTheme(systemTheme)

    const onChangeScheme = (e) => {
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
        metaThemeColor.setAttribute("content", theme.backgroundColor)
    }, [theme])

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default ClientThemeProvider
