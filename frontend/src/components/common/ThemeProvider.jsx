import { useClientTheme } from "@utils/clientSettings"
import { ThemeProvider } from "styled-components"

const ClientThemeProvider = ({children}) => {
    const theme = useClientTheme() 

    return <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
}

export default ClientThemeProvider
