import { Suspense } from "react"
import { RouterProvider } from "react-router-dom"

import mainRouter from "@routers/mainRouter"
import hashRouter from "@routers/hashRouter"

import FullscreenLoader from "@components/common/FullscreenLoader"
import Loading from "@components/settings/Loading"

import { useTheme } from "styled-components"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Root = () => {
    const theme = useTheme()

    return (
        <>
            <ToastContainer
                position="bottom-right"
                theme={theme.toastTheme}
                stacked
                hideProgressBar
            />

            <Suspense fallback={<FullscreenLoader />}>
                <RouterProvider router={mainRouter} />
            </Suspense>

            <Suspense fallback={<Loading />}>
                <RouterProvider router={hashRouter} />
            </Suspense>
        </>
    )
}

export default Root
