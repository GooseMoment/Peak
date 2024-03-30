import {
    Outlet,
    createBrowserRouter,
    redirect,
} from "react-router-dom"

import Layout from "@containers/Layout"
import AuthGuard from "@components/auth/AuthGuard"

import ErrorPage from "@pages/ErrorPage"
import NotificationsPage from "@pages/NotificationsPage"
import ProjectPage from "@pages/ProjectPage"
import ProjectListPage from "@pages/ProjectListPage"
import UserPage from "@pages/UserPage"
import LandingPage from "@pages/LandingPage"
import SignPage from "@pages/SignPage"

import taskCreates from "@pages/taskCreates/taskCreates"

import { getMe, getUserByUsername, isSignedIn } from "@api/users.api"
import { getProject, getProjectsList } from "@api/projects.api"

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
        element: <AuthGuard>
            <Layout>
                <Outlet />
            </Layout>
        </AuthGuard>,
        id: "app",
        loader: async () => {
            return {
                projects: await getProjectsList(),
                user: await getMe(),
            }
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
                }
            },
            {
                path: "projects/:id/taskcreates",
                Component: taskCreates.TaskCreateDetail,
                children: [
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
            {
                path: "users/:username",
                loader: async ({params}) => {
                    return getUserByUsername(params.username.slice(1))
                },
                element: <UserPage/>,
            },
            {
                path: "settings/:section",
                element: <div>This is /settings/:section</div>,
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