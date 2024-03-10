import {
    Outlet,
    createBrowserRouter
} from "react-router-dom"

import Layout from "@containers/Layout"

import ErrorPage from "@pages/ErrorPage"
import NotificationsPage from "@pages/NotificationsPage"
import SignInPage from "@pages/SignInPage"
import ProjectPage from "@pages/ProjectPage"
import SocialFollowingPage from "@/pages/SocialFollowingPage"
import SocialExplorePage from "@/pages/SocialExplorePage"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout>
            <Outlet />
        </Layout>,
        errorElement: <ErrorPage />,
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
                children: [
                    // TODO: Redirect?
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
                element: <div>This is /projects</div>,
            },
            {
                path: "projects/:id",
                element: <ProjectPage />,
            },
            {
                path: "users/:username",
                element: <div>This is /users/:username</div>,
            },
            {
                path: "settings/:section",
                element: <div>This is /settings/:section</div>,
            },
        ]
    },

])

export default router