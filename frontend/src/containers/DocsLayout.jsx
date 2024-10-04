import { Suspense } from "react"
import { Outlet } from "react-router-dom"

import styled from "styled-components"

import { LoaderCircleFull } from "@components/common/LoaderCircle"

const DocsLayout = () => {
    return (
        <Page>
            <Suspense
                key="app-layout"
                fallback={<LoaderCircleFull height="100dvh" />}>
                <Outlet />
            </Suspense>
        </Page>
    )
}

const Page = styled.div`
    min-height: 100dvh;
    max-width: 100dvw;
    padding-top: max(env(safe-area-inset-top), 2rem);
    padding-right: max(env(safe-area-inset-right), 1.5rem);
    padding-bottom: calc(2rem + 6rem);
    padding-left: max(env(safe-area-inset-left), 1.5rem);
`

export default DocsLayout
