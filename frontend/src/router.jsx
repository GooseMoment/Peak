import {
    createBrowserRouter,
    redirect,
} from "react-router-dom"

import AppLayout from "@containers/AppLayout"

import IntroPage from "@pages/IntroPage"
import SignPage from "@pages/SignPage"

import ErrorPage from "@pages/ErrorPage"
import NotificationsPage from "@pages/NotificationsPage"

import StartPage from "@pages/StartPage"
import TodayPage from "@pages/TodayPage"
import HomePage from "@pages/HomePage"

import ProjectPage from "@pages/ProjectPage"
import ProjectListPage from "@pages/ProjectListPage"

import SocialPage from "@pages/SocialPage"
import SocialFollowingPage from "@pages/SocialFollowingPage"
import SocialExplorePage from "@pages/SocialExplorePage"

import TaskCreateElement from "@components/project/taskDetails/TaskCreateElement"
import TaskDetailElement from "@components/project/taskDetails/TaskDetailElement"

import UserPage from "@pages/UserPage"

import { getMe, signOut } from "@api/users.api"
import { getProject, getProjectList } from "@api/projects.api"
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
                element: <IntroPage />,
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
                projects: await getProjectList(),
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
                element: <UserPage />,
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