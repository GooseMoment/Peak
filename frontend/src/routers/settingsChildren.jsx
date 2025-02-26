import { lazily } from "react-lazily"

const {
    Profile,
    General,
    Security,
    Privacy,
    LanguagesAndTime,
    Appearance,
    Reactions,
    Notifications,
    Blocks,
    Info,
} = lazily(() => import("@pages/settings/settings"))

const settingsChildren = [
    {
        index: true,
        element: null,
    },
    {
        path: "profile",
        element: <Profile />,
    },
    {
        path: "general",
        element: <General />,
    },
    {
        path: "security",
        element: <Security />,
    },
    {
        path: "privacy",
        element: <Privacy />,
    },
    {
        path: "languages-and-time",
        element: <LanguagesAndTime />,
    },
    {
        path: "appearance",
        element: <Appearance />,
    },
    {
        path: "reactions",
        element: <Reactions />,
    },
    {
        path: "notifications",
        element: <Notifications />,
    },
    {
        path: "blocks",
        element: <Blocks />,
    },
    {
        path: "info",
        element: <Info />,
    },
]

export default settingsChildren
