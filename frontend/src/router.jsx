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

import { getMe, getUserByUsername, isSignedIn } from "@api/users.api"

const routes = [
    {
        path: "/",
        errorElement: <ErrorPage />,
        loader: () => {
            if (isSignedIn()) {
                return redirect("/app/")
            }

            return null
        },
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
                children: [
                    {
                        index: true,
                        loader: () => redirect("/app/settings/account"),
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