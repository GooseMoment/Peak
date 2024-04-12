import { Outlet } from "react-router-dom"

import AuthGuard from "@components/auth/AuthGuard"
import Layout from "@containers/Layout"

const AppLayout = () => {
    return <AuthGuard>
        <Layout>
            <Outlet />
        </Layout>
    </AuthGuard>
}

export default AppLayout