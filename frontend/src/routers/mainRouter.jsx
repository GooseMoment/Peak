import { createBrowserRouter, redirect } from "react-router-dom"

import AppLayout from "@containers/AppLayout"

import ErrorPage from "@pages/ErrorPage"
import HomePage from "@pages/HomePage"
import NotificationsPage from "@pages/NotificationsPage"
import ProjectListPage from "@pages/ProjectListPage"
import ProjectPage from "@pages/ProjectPage"
import StartPage from "@pages/StartPage"
import TodayPage from "@pages/TodayPage"

import TaskCreateElement from "@components/project/taskDetails/TaskCreateElement"
import TaskDetailElement from "@components/project/taskDetails/TaskDetailElement"

import { getToken } from "@api/client"
import { getProjectList } from "@api/projects.api"
import { getMe, signOut } from "@api/users.api"

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
                children: [
                    {
                        index: true,
                        loader: () => redirect("/sign/in"),
                    },
                    {
                        path: "in",
                        async lazy() {
                            const { SignInForm } = await import(
                                "@components/sign/forms"
                            )
                            return { Component: SignInForm }
                        },
                    },
                    {
                        path: "up",
                        async lazy() {
                            const { SignUpForm } = await import(
                                "@components/sign/forms"
                            )
                            return { Component: SignUpForm }
                        },
                    },
                    {
                        path: "up-complete",
                        async lazy() {
                            const { SignUpComplete } = await import(
                                "@components/sign/forms"
                            )
                            return { Component: SignUpComplete }
                        },
                    },
                    {
                        path: "verification",
                        async lazy() {
                            const { EmailVerificationForm } = await import(
                                "@components/sign/forms"
                            )
                            return { Component: EmailVerificationForm }
                        },
                    },
                    {
                        path: "verification-resend",
                        async lazy() {
                            const { EmailVerificationResendForm } =
                                await import("@components/sign/forms")
                            return { Component: EmailVerificationResendForm }
                        },
                    },
                ],
            },
        ],
    },
    {
        path: "/app",
        element: <AppLayout />,
        id: "app",
        loader: async () => {
            if (!getToken()) {
                redirect("/")
            }

            return {
                projects: await getProjectList(),
                user: await getMe(),
            }
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
                async lazy() {
                    const { default: UserPage } = await import(
                        "@pages/UserPage"
                    )
                    return { Component: UserPage }
                },
            },
            {
                path: "sign_out",
                loader: () => {
                    signOut()
                    return redirect("/")
                },
                element: null,
            },
        ],
    },
]

const router = createBrowserRouter(routes)

export default router
