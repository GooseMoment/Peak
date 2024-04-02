import { Outlet, useLocation } from "react-router-dom"

import AuthGuard from "@components/auth/AuthGuard"
import Layout from "@containers/Layout"

const AppLayout = () => {
    const location = useLocation()
    return <AuthGuard>
        <Layout>
            <Outlet />
        </Layout>
    </AuthGuard>
}

export default AppLayout