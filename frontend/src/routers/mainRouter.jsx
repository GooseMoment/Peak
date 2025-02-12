import { Suspense, lazy } from "react"
import { Outlet, createBrowserRouter, redirect } from "react-router-dom"

import settingsChildren from "@routers/settingsChildren"
import signChildren from "@routers/signChildren"

import ErrorPage from "@pages/ErrorPage"
import StartPage from "@pages/StartPage"

import { LoaderCircleFull } from "@components/common/LoaderCircle"

import { signOut } from "@api/auth.api"
import { getToken } from "@api/client"

import { lazily } from "react-lazily"

const SearchPage = lazy(() => import("@pages/SearchPage"))
const HomePage = lazy(() => import("@pages/HomePage"))
const AnnouncementListPage = lazy(() => import("@pages/AnnouncementListPage"))
const AnnouncementDetailPage = lazy(
    () => import("@pages/AnnouncementDetailPage"),
)
const NotificationsPage = lazy(() => import("@pages/NotificationsPage"))
const TodayPage = lazy(() => import("@pages/TodayPage"))
const ProjectPage = lazy(() => import("@pages/ProjectPage"))
const ProjectListPage = lazy(() => import("@pages/ProjectListPage"))
const SettingsPage = lazy(() => import("@pages/SettingsPage"))

const { SocialRedirector, SocialFollowingPage, SocialExplorePage } = lazily(
    () => import("@pages/chunks/SocialPages"),
)

const UserPage = lazy(() => import("@pages/UserPage"))

const InstallInstructionPage = lazy(
    () => import("@pages/docs/InstallInstructionPage"),
)

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
        element: (
            <Suspense
                key="root"
                fallback={<LoaderCircleFull height="100dvh" />}>
                <Outlet />
            </Suspense>
        ),
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
                path: "announcements",
                element: <AnnouncementListPage />,
            },
            {
                path: "announcements/:id",
                element: <AnnouncementDetailPage />,
            },
            {
                path: "social",
                children: [
                    {
                        index: true,
                        element: <SocialRedirector />,
                    },
                    {
                        path: "following",
                        element: <SocialFollowingPage />,
                    },
                    {
                        path: "explore",
                        element: <SocialExplorePage />,
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
    {
        path: "/docs",
        async lazy() {
            const { default: DocsLayout } = await import(
                "@containers/DocsLayout"
            )
            return { element: <DocsLayout /> }
        },
        children: [
            {
                path: "install-instruction",
                element: <InstallInstructionPage />,
            },
        ],
    },
]

const router = createBrowserRouter(routes)

export default router
