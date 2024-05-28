import { useState, useEffect } from "react"

import { useClientTheme } from "@utils/clientSettings"
import { ThemeProvider } from "styled-components"

const ClientThemeProvider = ({children}) => {
    const windowMatchMediaDark = window.matchMedia('(prefers-color-scheme: dark)')

    const [systemTheme, setSystemTheme] = useState(
        window.matchMedia && windowMatchMediaDark.matches ? "dark" : "light"
    )

    const onChangeScheme = (e) => {
        setSystemTheme(e.matches ? "dark" : "light")
    }

    useEffect(() => {
        windowMatchMediaDark.addEventListener("change", onChangeScheme)

        return () => {
            windowMatchMediaDark.removeEventListener("change", onChangeScheme)
        }
    }, [])

    const theme = useClientTheme(systemTheme) 

    return <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
}

export default ClientThemeProvider
