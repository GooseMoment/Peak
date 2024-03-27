import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom"

import Layout from "@containers/Layout"
import PageTitle from "@components/common/PageTitle"

import { KEY_IS_SIGNED_IN } from "@api/client";

const ErrorPage = () => {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        if (error.status === 401) {
            localStorage.removeItem(KEY_IS_SIGNED_IN)

            return <Layout noSidebar>
                <PageTitle>Please sign in again</PageTitle>
                <Link to="/sign?flag=401">Go to sign page</Link>
            </Layout>
        }

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