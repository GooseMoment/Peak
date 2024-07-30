import useScreenSize from "@utils/useScreenSize"

export const WIDTH_S = 500
export const WIDTH_M = 1000

export const useScreenType = () => {
    const screenSize = useScreenSize()

    if (screenSize.width <= WIDTH_S) {
        return "S"
    }

    if (screenSize.width <= WIDTH_M) {
        return "M"
    }

    return "L"
}

export const ifWidthS = `@media screen and (max-width: ${WIDTH_S}px)`
export const ifWidthM = `@media screen and (max-width: ${WIDTH_M}px)`
