import { RouterProvider } from "react-router-dom"

import { useTheme } from "styled-components"

import mainRouter from "@routers/mainRouter"

import FullscreenLoader from "@components/common/FullscreenLoader"

import useScreenType from "@utils/useScreenType"

import { Bounce, Slide, ToastContainer } from "react-toastify"

const Root = () => {
    const theme = useTheme()
    const { isMobile } = useScreenType()

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

export default Root
