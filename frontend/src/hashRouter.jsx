import { createHashRouter } from "react-router-dom"

import settings from "@pages/settings/settings"

const routes = [
    {
        path: "/",
        element: null,
    },
    { 
        path: "settings",
        Component: settings.Layout,
        id: "settings",
        children: [
            {
                index: true,
                element: null,
            },
            {
                path: "account",
                Component: settings.Account,
            },
            {
                path: "privacy",
                Component: settings.Privacy,
            },
            {
                path: "languages-and-region",
                Component: settings.LanguagesAndRegion,
            },
            {
                path: "appearance",
                Component: settings.Appearance,
            },
            {
                path: "reactions",
                Component: settings.Reactions,
            },
            {
                path: "notifications",
                Component: settings.Notifications,
            },
            {
                path: "blocks",
                Component: settings.Blocks,
            },
            {
                path: "info",
                Component: settings.Info,
            },
        ]
    },
]

const hashRouter = createHashRouter(routes)

export default hashRouter
