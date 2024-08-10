import { lazily } from "react-lazily"

const {
    Account,
    General,
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
        path: "account",
        element: <Account />,
    },
    {
        path: "general",
        element: <General />,
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
