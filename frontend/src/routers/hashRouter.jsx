import { createHashRouter } from "react-router-dom"

const routes = [
    {
        path: "/",
        element: null,
    },
    {
        path: "settings",
        id: "settings",
        async lazy() {
            const { Layout, ErrorPage } = await import(
                "@pages/settings/settings"
            )
            return { Component: Layout, ErrorBoundary: ErrorPage }
        },
        children: [
            {
                index: true,
                element: null,
            },
            {
                path: "account",
                async lazy() {
                    const { Account } = await import("@pages/settings/settings")
                    return { Component: Account }
                },
            },
            {
                path: "general",
                async lazy() {
                    const { General } = await import("@pages/settings/settings")
                    return { Component: General }
                },
            },
            {
                path: "privacy",
                async lazy() {
                    const { Privacy } = await import("@pages/settings/settings")
                    return { Component: Privacy }
                },
            },
            {
                path: "languages-and-time",
                async lazy() {
                    const { LanguagesAndTime } = await import(
                        "@pages/settings/settings"
                    )
                    return { Component: LanguagesAndTime }
                },
            },
            {
                path: "appearance",
                async lazy() {
                    const { Appearance } = await import(
                        "@pages/settings/settings"
                    )
                    return { Component: Appearance }
                },
            },
            {
                path: "reactions",
                async lazy() {
                    const { Reactions } = await import(
                        "@pages/settings/settings"
                    )
                    return { Component: Reactions }
                },
            },
            {
                path: "notifications",
                async lazy() {
                    const { Notifications } = await import(
                        "@pages/settings/settings"
                    )
                    return { Component: Notifications }
                },
            },
            {
                path: "blocks",
                async lazy() {
                    const { Blocks } = await import("@pages/settings/settings")
                    return { Component: Blocks }
                },
            },
            {
                path: "info",
                async lazy() {
                    const { Info } = await import("@pages/settings/settings")
                    return { Component: Info }
                },
            },
        ],
    },
]

const hashRouter = createHashRouter(routes)

export default hashRouter
