import { Suspense } from "react"
import { RouterProvider } from "react-router-dom"

import router from "@/router"
import hashRouter from "@/hashRouter"
import Loading from "@components/settings/Loading"

import { useTheme } from "styled-components"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Root = () => {
    const theme = useTheme()

    return <>
        <ToastContainer position="bottom-right" theme={theme.toastTheme} stacked hideProgressBar />

        <Suspense fallback={<Loading />}>
            <RouterProvider router={router} />
        </Suspense>

        <Suspense fallback={<Loading />}>
            <RouterProvider router={hashRouter} />
        </Suspense>
    </>
}

export default Root 
