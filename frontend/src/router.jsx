import {
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
import TaskCreateElement from "@pages/taskDetails/TaskCreateElement"
import TaskDetailElement from "@pages/taskDetails/TaskDetailElement"

import { getMe, getUserByUsername, signOut } from "@api/users.api"
import { getProject, getProjectsList } from "@api/projects.api"
import { getToken } from "@api/client"

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
            if (!getToken()) {
                redirect("/")
            }

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
                children: [
                    {
                        index: true,
                        element: <SocialPage />
                    },
                    {
                        path: "following",
                        element: <SocialFollowingPage />,
                        // id: 'social',
                        // loader: async () => {
                        //     return {
                        //         dailyLogPreview: await getDailyReport(),
                        //     }
                        // },
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
                loader: async ({params}) => {
                    const project = await getProject(params.id)
                    return {project}
                },
                children: [
                    {
                        path: "tasks/create/",
                        element: <TaskCreateElement />,
                    },
                    {
                        path: "tasks/:task_id/detail/",
                        id: "task",
                        element: <TaskDetailElement/>,
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
            {
                path: "sign_out",
                loader: () => {
                    signOut()
                    return redirect("/")
                },
                element: null,
            },
        ]
    }
]

const router = createBrowserRouter(routes)

export default router