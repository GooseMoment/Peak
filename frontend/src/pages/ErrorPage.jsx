import { Link, useRouteError } from "react-router-dom"

import Layout from "@/containers/Layout"

const ErrorPage = () => {
    const error = useRouteError();

    console.log(error)

    return <Layout noSidebar={true}>
        <h1>{error.status}: {error.statusText}</h1>
        <p>To GooseMoment Dev, if you encouter this error, please check <code>@/router.jsx</code>.</p>
        <Link to="/">Go to index</Link>
    </Layout>
}

export default ErrorPage