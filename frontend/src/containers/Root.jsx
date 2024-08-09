import { Suspense } from "react"
import { RouterProvider } from "react-router-dom"

import { useTheme } from "styled-components"

import mainRouter from "@routers/mainRouter"

import FullscreenLoader from "@components/common/FullscreenLoader"

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
        </>
    )
}

export default Root
