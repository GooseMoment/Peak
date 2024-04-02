import {
    createBrowserRouter,
    redirect,
} from "react-router-dom"

import AppLayout from "@containers/AppLayout"

import ErrorPage from "@pages/ErrorPage"
import NotificationsPage from "@pages/NotificationsPage"
import ProjectPage from "@pages/ProjectPage"
import UserPage from "@pages/UserPage"
import LandingPage from "@pages/LandingPage"
import SignPage from "@pages/SignPage"

import settings from "@pages/settings/settings"

import notify from "@utils/notify"

import { getMe, getUserByUsername, isSignedIn, patchUser } from "@api/users.api"
import { getSettings, patchSettings } from "@api/user_setting.api"

const redirectIfSignedIn = () => {
    if (isSignedIn()) {
        return redirect("/app/")
    }

    return null
}

const routes = [
    {
        path: "/",
        errorElement: <ErrorPage />,
        loader: redirectIfSignedIn,
        children: [
            {
                index: true,
                element: <LandingPage />,
            },
            {
                path: "sign",
                element: <SignPage />,
            },
        ]
    },
    {
        path: "/app",
        element: <AppLayout />,
        id: "app",
        loader: async () => {
            return getMe()
        },
        shouldRevalidate: ({currentUrl}) => {
            return currentUrl.pathname.startsWith("/app/settings/account")
        },
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <div>This is /</div>,
            },
            {
                path: "search",
                element: <div>This is /search</div>,
            },
            {
                path: "notifications",
                element: <NotificationsPage />,
            },
            {
                path: "tasks/:id",
                element: <div>This is /tasks/:id</div>,
            },
            {
                path: "today",
                element: <div>This is /today</div>,
            },
            {
                path: "social",
                element: <div>This is /social</div>,
            },
            {
                path: "projects",
                element: <div>This is /projects</div>,
            },
            {
                path: "projects/:id",
                element: <ProjectPage/>,
            },
            {
                path: "users/:username",
                loader: async ({params}) => {
                    return getUserByUsername(params.username.slice(1))
                },
                element: <UserPage/>,
            },
            { /* TODO: split settings */
                path: "settings",
                Component: settings.Layout,
                id: "settings",
                action: async ({request}) => {
                    const formData = await request.formData()
                    const data = Object.fromEntries(formData)

                    await patchSettings(data)
                    notify.success("Settings were saved.")
                    return null
                },
                loader: async () => {
                    return getSettings()
                },
                children: [
                    {
                        index: true,
                        Component: settings.Redirect,
                    },
                    {
                        path: "account",
                        Component: settings.Account,
                        action: async ({request}) => {
                            const formData = await request.formData()
                            const data = Object.fromEntries(formData)
                            
                            await patchUser(data)
                            notify.success("Profile was edited.")
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
                    },
                ]
            },
            {
                // TODO: remove this and add signOut api callback
                path: "sign_out",
                loader: () => {
                    localStorage.removeItem("is_signed_in")
                    return redirect("/")
                },
                element: <div>Goodbye</div>,
            },
        ]
    }
]

const router = createBrowserRouter(routes)

export default router