import { Link, useRouteError } from "react-router-dom"

import RootLayout from "@/containers/RootLayout"

const ErrorPage = () => {
    const error = useRouteError();

    return <RootLayout noSidebar={true}>
        <h1>{error.status}: {error.statusText}</h1>
        <p>To GooseMoment Dev, if you encouter this error, please check <code>@/router.jsx</code>.</p>
        <Link to="/">Go to index</Link>
    </RootLayout>
}

export default ErrorPage