import { type ReactNode, createContext, useContext, useMemo } from "react"

import useScreenSize from "@utils/useScreenSize"

export const WIDTH_MOBILE = 500
export const WIDTH_TABLET = 1024

interface ScreenType {
    widthType: "mobile" | "tablet" | "desktop"
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
}

const ScreenTypeContext = createContext<ScreenType | undefined>(undefined)

export function ScreenTypeProvider({ children }: { children: ReactNode }) {
    const screenSize = useScreenSize()

    const screenType: ScreenType = useMemo(() => {
        if (screenSize.width <= WIDTH_MOBILE) {
            return {
                widthType: "mobile",
                isMobile: true,
                isTablet: false,
                isDesktop: false,
            }
        }

        if (
            WIDTH_MOBILE < screenSize.width &&
            screenSize.width <= WIDTH_TABLET
        ) {
            return {
                widthType: "tablet",
                isMobile: false,
                isTablet: true,
                isDesktop: false,
            }
        }

        return {
            widthType: "desktop",
            isMobile: false,
            isTablet: false,
            isDesktop: true,
        }
    }, [screenSize.width])

    return (
        <ScreenTypeContext.Provider value={screenType}>
            {children}
        </ScreenTypeContext.Provider>
    )
}

export default function useScreenType() {
    const context = useContext(ScreenTypeContext)
    if (!context) {
        throw new Error(
            "useScreenType must be used within a ScreenTypeProvider",
        )
    }
    return context
}

export const ifMobile = `@media screen and (max-width: ${WIDTH_MOBILE}px)`
export const ifTablet = `@media screen and (max-width: ${WIDTH_TABLET}px)`
