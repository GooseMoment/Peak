import useScreenSize from "@utils/useScreenSize"

export const WIDTH_MOBILE = 500
export const WIDTH_TABLET = 1024

const useScreenType = () => {
    const screenSize = useScreenSize()

    let screenType = {
        widthType: "desktop",
        isMobile: false,
        isTablet: false,
        isDesktop: false,
    }

    if (screenSize.width <= WIDTH_MOBILE) {
        screenType.widthType = "mobile"

        screenType.isMobile = true
        screenType.isTablet = false
        screenType.isDesktop = false
    }

    if (WIDTH_MOBILE < screenSize.width && screenSize.width <= WIDTH_TABLET) {
        screenType.widthType = "tablet"

        screenType.isMobile = false
        screenType.isTablet = true
        screenType.isDesktop = false
    }

    if (WIDTH_TABLET < screenSize.width) {
        screenType.widthType = "desktop"

        screenType.isMobile = false
        screenType.isTablet = false
        screenType.isDesktop = true
    }

    return screenType
}

export default useScreenType

export const ifMobile = `@media screen and (max-width: ${WIDTH_MOBILE}px)`
export const ifTablet = `@media screen and (max-width: ${WIDTH_TABLET}px)`
