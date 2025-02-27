import { StrictMode, Suspense } from "react"
import { Outlet } from "react-router-dom"

import Layout from "@containers/Layout"

import { LoaderCircleFull } from "@components/common/LoaderCircle"
import { SidebarContextProvider } from "@components/sidebar/SidebarContext"

const AppLayout = () => {
    return (
        <StrictMode>
            <SidebarContextProvider>
                <Layout>
                    <Suspense
                        key="app-layout"
                        fallback={<LoaderCircleFull height="100dvh" />}>
                        <Outlet />
                    </Suspense>
                </Layout>
            </SidebarContextProvider>
        </StrictMode>
    )
}

export default AppLayout
