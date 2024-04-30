import { createHashRouter } from "react-router-dom"

import settings from "@pages/settings/settings"

import { getSettings, patchSettings } from "@api/user_setting.api"
import { getBlocks, getMe, patchUser } from "@api/users.api"

import { toast } from "react-toastify"

const routes = [
    {
        path: "/",
        element: null,
    },
    { 
        path: "settings",
        Component: settings.Layout,
        id: "settings",
        action: async ({request}) => {
            const formData = await request.formData()
            const data = Object.fromEntries(formData)

            await patchSettings(data)
            toast.success("Settings were saved.")
            return null
        },
        loader: async () => {
            return {
                settings: await getSettings(),
                user: await getMe(),
            }
        },
        children: [
            {
                index: true,
                element: null,
            },
            {
                path: "account",
                Component: settings.Account,
                action: async ({request}) => {
                    const formData = await request.formData()
                    const data = Object.fromEntries(formData)
                    
                    await patchUser(data)
                    toast.success("Profile was edited.")
                    return null
                },
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
                loader: async () => {
                    const user = await getMe()
                    return getBlocks(user.username)
                },
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
