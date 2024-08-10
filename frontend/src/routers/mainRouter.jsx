import { lazy } from "react"
import { createBrowserRouter, redirect } from "react-router-dom"

import settingsChildren from "@routers/settingsChildren"
import signChildren from "@routers/signChildren"

import AppLayout from "@containers/AppLayout"

import ErrorPage from "@pages/ErrorPage"
import HomePage from "@pages/HomePage"
import NotificationsPage from "@pages/NotificationsPage"
import ProjectListPage from "@pages/ProjectListPage"
import ProjectPage from "@pages/ProjectPage"
import SettingsPage from "@pages/SettingsPage"
import StartPage from "@pages/StartPage"
import TodayPage from "@pages/TodayPage"

import TaskCreateElement from "@components/project/taskDetails/TaskCreateElement"
import TaskDetailElement from "@components/project/taskDetails/TaskDetailElement"

import { getToken } from "@api/client"
import { signOut } from "@api/users.api"

const UserPage = lazy(() => import("@pages/UserPage"))

const redirectIfSignedIn = () => {
    if (getToken()) {
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
                async lazy() {
                    const { IntroPage } = await import(
                        "@pages/chunks/OutsidePages"
                    )
                    return { Component: IntroPage }
                },
            },
            {
                path: "sign",
                async lazy() {
                    const { SignPage } = await import(
                        "@pages/chunks/OutsidePages"
                    )
                    return { element: <SignPage /> }
                },
                children: signChildren,
            },
        ],
    },
    {
        path: "/app",
        element: <AppLayout />,
        id: "app",
        loader: async () => {
            if (!getToken()) {
                window.location = "/"
                // The function 'redirect' can't be used here; redirect("/") redirects to "/app/".
            }

            return null
        },
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <StartPage />,
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
                path: "today",
                element: <TodayPage />,
            },
            {
                path: "home",
                element: <HomePage />,
            },
            {
                path: "social",
                children: [
                    {
                        index: true,
                        async lazy() {
                            const { SocialRedirector } = await import(
                                "@pages/chunks/SocialPages"
                            )
                            return { Component: SocialRedirector }
                        },
                    },
                    {
                        path: "following",
                        async lazy() {
                            const { SocialFollowingPage } = await import(
                                "@pages/chunks/SocialPages"
                            )
                            return { Component: SocialFollowingPage }
                        },
                    },
                    {
                        path: "explore",
                        async lazy() {
                            const { SocialExplorePage } = await import(
                                "@pages/chunks/SocialPages"
                            )
                            return { Component: SocialExplorePage }
                        },
                    },
                ],
            },
            {
                path: "projects",
                element: <ProjectListPage />,
            },
            {
                path: "projects/:id",
                element: <ProjectPage />,
                children: [
                    {
                        path: "tasks/create/",
                        element: <TaskCreateElement />,
                    },
                    {
                        path: "tasks/:task_id/detail/",
                        id: "task",
                        element: <TaskDetailElement />,
                    },
                ],
            },
            {
                path: "users/:username",
                element: <UserPage />,
            },
            {
                path: "settings",
                element: <SettingsPage />,
                children: settingsChildren,
            },
            {
                path: "sign_out",
                loader: signOut,
                element: null,
            },
        ],
    },
]

const router = createBrowserRouter(routes)

export default router
