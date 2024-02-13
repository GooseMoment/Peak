import {
    createBrowserRouter
} from "react-router-dom"

import RootLayout from "@containers/RootLayout"

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <div>This is /</div>,
            },
            {
                path: "search",
                element: <div>This is /search</div>,
            },
            {
                path: "notifications",
                element: <div>This is /notifications</div>,
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
                element: <div>This is /projects/:id</div>,
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