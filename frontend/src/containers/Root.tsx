import { RouterProvider } from "react-router-dom"

import { useTheme } from "styled-components"

import mainRouter from "@routers/mainRouter"

import FullscreenLoader from "@components/common/FullscreenLoader"

import useScreenType from "@utils/useScreenType"
import useUpdatePrompt from "@utils/useUpdatePrompt"

import { Bounce, Slide, ToastContainer } from "react-toastify"

export default function Root() {
    const theme = useTheme()
    const { isMobile } = useScreenType()
    useUpdatePrompt()

    return (
        <>
            <ToastContainer
                position="bottom-right"
                theme={theme.toastTheme}
                stacked
                hideProgressBar
                transition={isMobile ? Slide : Bounce}
            />

            <RouterProvider
                router={mainRouter}
                fallbackElement={<FullscreenLoader />}
            />
        </>
    )
}
