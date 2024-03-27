import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom"

import Layout from "@containers/Layout"
import PageTitle from "@components/common/PageTitle"

const ErrorPage = () => {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return <Layout>
            <PageTitle>{error.status}: {error.statusText}</PageTitle>
            <p>라우터 에러!</p>
            <Link to="">Go to index</Link>
        </Layout>
    }

    console.log(error)

    return <Layout noSidebar={true}>
        <PageTitle>이런!</PageTitle>
        <p>라우터 외의 에러입니다. 콘솔 확인하세요.</p>
        <Link to="">Go to index</Link>
    </Layout>
}

export default ErrorPage