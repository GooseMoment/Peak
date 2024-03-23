import { Link, useRouteError } from "react-router-dom"

import Layout from "@containers/Layout"

const ErrorPage = () => {
    const error = useRouteError();

    console.log(error)

    return <Layout noSidebar={true}>
        <h1>{error.status}: {error.statusText}</h1>
        <p>브라우저 콘솔 확인하세요</p>
        <Link to="">Go to index</Link>
    </Layout>
}

export default ErrorPage