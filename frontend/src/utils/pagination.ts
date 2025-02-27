export const getPageFromURL = (url: null | string): null | string => {
    if (!url) return null

    let u: URL
    if (typeof url === "string") {
        u = new URL(url)
    } else {
        u = url
    }

    const page = u.searchParams.get("page")
    return page
}

export const getCursorFromURL = (url: null | string): null | string => {
    if (!url) return null

    let u: URL
    if (typeof url === "string") {
        u = new URL(url)
    } else {
        u = url
    }

    const cursor = u.searchParams.get("cursor")
    return cursor
}
