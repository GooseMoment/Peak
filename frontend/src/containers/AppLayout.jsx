import { Outlet } from "react-router-dom"

import AuthGuard from "@components/auth/AuthGuard"
import Layout from "@containers/Layout"

import { defaultTheme } from "@assets/themes"
import { ThemeProvider } from "styled-components"

const AppLayout = () => {
    return <AuthGuard>
        <ThemeProvider theme={defaultTheme}>
            <Layout>
                <Outlet />
            </Layout>
        </ThemeProvider>
    </AuthGuard>
}

export default AppLayout