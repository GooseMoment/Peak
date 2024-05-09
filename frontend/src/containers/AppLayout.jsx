import { Outlet } from "react-router-dom"

import AuthGuard from "@components/auth/AuthGuard"
import Layout from "@containers/Layout"

import { QueryClientProvider } from "@tanstack/react-query"
import queryClient from "@queries/queryClient"

const AppLayout = () => {
    return <AuthGuard>
        <QueryClientProvider client={queryClient}>
            <Layout>
                <Outlet />
            </Layout>
        </QueryClientProvider>
    </AuthGuard>
}

export default AppLayout