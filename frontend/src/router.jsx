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
import UserPage from "@pages/UserPage"
import LandingPage from "@pages/LandingPage"
import SignPage from "@pages/SignPage"

import { getMe, getUserByUsername, isSignedIn } from "@api/users.api"

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
        element: <AuthGuard>
            <Layout>
                <Outlet />
            </Layout>
        </AuthGuard>,
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