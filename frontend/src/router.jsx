import {
    Outlet,
    createBrowserRouter
} from "react-router-dom"

import Layout from "@containers/Layout"

import ErrorPage from "@pages/ErrorPage"
import NotificationsPage from "@pages/NotificationsPage"
import SignInPage from "@pages/SignInPage"
import ProjectPage from "@pages/ProjectPage"
import UserPage from "@pages/UserPage"

import { getMe, getUserByUsername } from "@api/users.api"

const routes = [
    {
        path: "/",
        element: <Layout>
            <Outlet />
        </Layout>,
        errorElement: <ErrorPage />,
        id: "app",
        loader: async () => {
            return getMe()
        },
        children: [
            {
                path: "/",
                element: <div>This is /</div>,
            },
            {
                path: "sign_in",
                element: <SignInPage />, // TODO: REMOVE
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
        ]
    }
]

const router = createBrowserRouter(routes, {
    // https://reactrouter.com/en/main/routers/create-browser-router#basename
    basename: "/app"
})

export default router