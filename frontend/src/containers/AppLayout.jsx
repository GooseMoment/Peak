import { Suspense } from "react"
import { Outlet } from "react-router-dom"

import Layout from "@containers/Layout"

import { LoaderCircleFull } from "@components/common/LoaderCircle"

const AppLayout = () => {
    return (
        <Layout>
            <Suspense key="app-layout" fallback={<LoaderCircleFull />}>
                <Outlet />
            </Suspense>
        </Layout>
    )
}

export default AppLayout
