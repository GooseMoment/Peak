import { Outlet } from "react-router-dom"

import Layout from "@containers/Layout"

const AppLayout = () => {
    return (
        <Layout>
            <Outlet />
        </Layout>
    )
}

export default AppLayout
