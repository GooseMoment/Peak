export const getPageFromURL = (url: null | string | URL): null | string => {
    if (url === null || url === "") {
        return url
    }

    const u = new URL(url)
    const page = u.searchParams.get("page")
    return page
}

export const getCursorFromURL = (url: null | string | URL): null | string => {
    if (url === null || url === "") {
        return url
    }

    const u = new URL(url)
    const cursor = u.searchParams.get("cursor")
    return cursor
}
