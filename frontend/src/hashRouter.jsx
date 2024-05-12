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
        errorElement: <settings.ErrorPage />,
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
                path: "languages-and-time",
                Component: settings.LanguagesAndTime,
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
