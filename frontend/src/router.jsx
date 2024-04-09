import {
    Outlet,
    createBrowserRouter,
    redirect,
} from "react-router-dom"

import AppLayout from "@containers/AppLayout"

import ErrorPage from "@pages/ErrorPage"
import NotificationsPage from "@pages/NotificationsPage"
import ProjectPage from "@pages/ProjectPage"
import ProjectListPage from "@pages/ProjectListPage"
import SocialPage from "@pages/SocialPage"
import SocialFollowingPage from "@pages/SocialFollowingPage"
import SocialExplorePage from "@pages/SocialExplorePage"
import UserPage from "@pages/UserPage"
import LandingPage from "@pages/LandingPage"
import SignPage from "@pages/SignPage"
import taskCreates from "@pages/taskDetails/taskCreates"

import notify from "@utils/notify"

import { getMe, getUserByUsername, isSignedIn, patchUser } from "@api/users.api"
import { getSettings, patchSettings } from "@api/user_setting.api"
import { getProject, getProjectsList } from "@api/projects.api"
import settings from "@pages/settings/settings"
import ModalPortal from "@components/common/ModalPortal"
import { getTasksByDrawer, getTask, patchTask } from "@api/tasks.api"

import { QueryClientProvider } from "@tanstack/react-query"
import queryClient from "@queries/queryClient"

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
            return currentUrl.pathname.startsWith("/app/settings/account") || currentUrl.pathname === "/app/projects"
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
                element: <QueryClientProvider client={queryClient}>
                    <NotificationsPage />
                </QueryClientProvider>,
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
                children: [
                    {
                        index: true,
                        element: <SocialPage />
                    },
                    {
                        path: "following",
                        element: <SocialFollowingPage />,
                    },
                    {
                        path: "explore",
                        element: <SocialExplorePage />,
                    },
                ]
            },
            {
                path: "projects",
                element: <ProjectListPage/>,
            },
            {
                path: "projects/:id",
                element: <ProjectPage/>,
                action: async ({request}) => {
                    const formData = await request.formData()
                    let data = {}
                    for (const [k, v] of Object.entries(Object.fromEntries(formData))) {
                        if (v === "null") {
                            data[k] = null
                            continue
                        }
                        
                        data[k] = v
                    }
                    return patchTask(data.id, data)
                },
                loader: async ({params}) => {
                    const tasksByDrawer = new Map()
                    const project = await getProject(params.id)
                    for (const drawer of project.drawers) {
                        let tasks = await getTasksByDrawer(drawer.id)
                        tasksByDrawer.set(drawer.id, tasks)
                    }
                    return {project, tasksByDrawer}
                },
                children: [
                    {
                        path: "tasks/:task_id/detail/",
                        id: "task",
                        action: async ({request, params}) => {
                            const formData = await request.formData()
                            return patchTask(params.task_id, Object.fromEntries(formData))
                        },
                        loader: async ({params}) => {
                            const task = await getTask(params.task_id)
                            return task
                        },
                        element: <taskCreates.TaskDetailElement />,
                        children: [
                            {
                                index: true,
                            },
                            {
                                path: "due",
                                Component: taskCreates.Calendar,
                            },
                            {
                                path: "reminder",
                                Component: taskCreates.Reminder,
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