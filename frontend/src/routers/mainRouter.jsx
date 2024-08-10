import { lazy } from "react"
import { createBrowserRouter, redirect } from "react-router-dom"

import settingsChildren from "@routers/settingsChildren"
import signChildren from "@routers/signChildren"

import ErrorPage from "@pages/ErrorPage"
import HomePage from "@pages/HomePage"
import NotificationsPage from "@pages/NotificationsPage"
import ProjectListPage from "@pages/ProjectListPage"
import ProjectPage from "@pages/ProjectPage"
import SearchPage from "@pages/SearchPage"
import SettingsPage from "@pages/SettingsPage"
import StartPage from "@pages/StartPage"
import TodayPage from "@pages/TodayPage"

import { getToken } from "@api/client"
import { signOut } from "@api/users.api"

import { lazily } from "react-lazily"

const { TaskCreateElement, TaskDetailElement } = lazily(
    () => import("@components/project/taskDetails/TaskElements"),
)

const UserPage = lazy(() => import("@pages/UserPage"))

const redirectIfSignedIn = () => {
    if (getToken()) {
        return redirect("/app/")
    }

    return null
}

/***
 * # Lazy 로드의 세 가지 방법
 *
 * 1. React Router의 lazy 함수: <RouterProvider>의 fallbackElement를 보여준다.
 *    현재 fallbackElement가 FullScreenLoader이므로, IntroPage나 SignPage에 적합.
 * 2. React.lazy(): .default가 필요하면 사용. (named exports 사용 불가) startTransition의 도움이 필요.
 * 3. lazily(): named exports가 필요하면 사용. named exports를 한 번에 가져올 수 있음! 
 *    (.default 사용 불가) 역시 startTransition 필요.
 *
 * 세 가지 다 특징이 있으니, 적합하게 사용하자
 */

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
        async lazy() {
            const { default: AppLayout } = await import("@containers/AppLayout")
            return { element: <AppLayout /> }
        },
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
                element: <SearchPage />,
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
