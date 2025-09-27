import { Suspense } from "react"
import { Outlet } from "react-router-dom"

import Layout from "@containers/Layout"

import { LoaderCircleFull } from "@components/common/LoaderCircle"
import { SidebarContextProvider } from "@components/sidebar/SidebarContext"

export default function AppLayout() {
    return (
        <SidebarContextProvider>
            <Layout>
                <Suspense
                    key="app-layout"
                    fallback={<LoaderCircleFull height="100dvh" />}>
                    <Outlet />
                </Suspense>
            </Layout>
        </SidebarContextProvider>
    )
}
