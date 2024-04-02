import {
    createBrowserRouter,
    redirect,
} from "react-router-dom"

import AppLayout from "@containers/AppLayout"

import ErrorPage from "@pages/ErrorPage"
import NotificationsPage from "@pages/NotificationsPage"
import ProjectPage from "@pages/ProjectPage"
import ProjectListPage from "@pages/ProjectListPage"
import UserPage from "@pages/UserPage"
import LandingPage from "@pages/LandingPage"
import SignPage from "@pages/SignPage"
import taskCreates from "@pages/taskDetails/taskCreates"

import { getMe, getUserByUsername, isSignedIn } from "@api/users.api"
import { getSettings, patchSettings } from "@api/user_setting.api"
import { getProject, getProjectsList } from "@api/projects.api"
import settings from "@pages/settings/settings"

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
            return {
                projects: await getProjectsList(),
                user: await getMe(),
            }
        },
        shouldRevalidate: ({currentUrl}) => {
            return currentUrl.pathname.startsWith("/app/users/")
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
                element: <ProjectListPage/>,
            },
            {
                path: "projects/:id",
                element: <ProjectPage/>,
                loader: async ({params}) => {
                    return getProject(params.id)
                },
                children: [
                    {
                        path: "tasks/:task_id/detail/",
                        children: [
                            {
                                path: "true",
                                Component: taskCreates.TaskCreateDetail,
                            },
                            {
                                path: "due",
                                Component: taskCreates.Calendar,
                            },
                            {
                                path: "reminder",
                                Component: taskCreates.Calendar,
                            },
                            {
                                path: "priority",
                                Component: taskCreates.Priority,
                            },
                            {
                                path: "Drawer",
                                Component: taskCreates.Drawer,
                            },
                            {
                                path: "memo",
                                Component: taskCreates.Memo,
                            },
                        ]
                    },
                ]
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
                    return patchSettings(Object.fromEntries(formData))
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