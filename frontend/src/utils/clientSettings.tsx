import {
    type ReactNode,
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react"

import { LightDark } from "styled-components"

import type { WebPushSubscription } from "@api/notifications.api"

import themes from "@assets/themes"

const KEY_CLIENT_SETTINGS = "client_settings"

interface Setting {
    startpage: "home" | "today"
    delete_task_after_alert: boolean

    // Languages & Region
    //      locale = language + "-" + region
    locale: string
    timezone: string

    start_of_the_week_monday: boolean
    time_as_24_hour: boolean

    // Notifications
    push_notification_subscription?: WebPushSubscription["id"]
    push_notification_excluded_types?: WebPushSubscription["excluded_types"]
    play_notification_sound: boolean

    // Appearance
    theme: "system" | LightDark
    main_width: "2rem" | "5rem" | "7rem"
    close_sidebar_on_startup: boolean
}

const defaultSettings: Setting = {
    startpage: "home",
    delete_task_after_alert: true,
    locale: "system",
    timezone: "system",
    start_of_the_week_monday: false,
    time_as_24_hour: false,
    push_notification_subscription: undefined,
    push_notification_excluded_types: [],
    play_notification_sound: true,
    theme: "system",
    main_width: "5rem",
    close_sidebar_on_startup: false,
}

export const getClientSettings = () => {
    const savedSettings = localStorage.getItem(KEY_CLIENT_SETTINGS)

    try {
        return (
            (savedSettings && (JSON.parse(savedSettings) as Setting)) ||
            defaultSettings
        )
    } catch {
        return defaultSettings
    }
}

export const setClientSettingsByName = <
    K extends keyof Setting,
    V extends Setting[K],
>(
    name: K,
    value: V,
) => {
    const settings = getClientSettings()
    settings[name] = value
    localStorage.setItem(KEY_CLIENT_SETTINGS, JSON.stringify(settings))
}

export const initClientSettings = () => {
    let settings = getClientSettings()
    if (!settings.theme) {
        settings = defaultSettings
    }
    settings = Object.assign({}, defaultSettings, settings)
    localStorage.setItem(KEY_CLIENT_SETTINGS, JSON.stringify(settings))
}

function dummyUpdateSetting<K extends keyof Setting, V extends Setting[K]>(
    _k: K,
    _v: V,
) {}

const ClientSettingContext = createContext([
    defaultSettings,
    dummyUpdateSetting,
] as [Setting, typeof dummyUpdateSetting])

export const ClientSettingProvider = ({
    children,
}: {
    children?: ReactNode
}) => {
    const [setting, setSetting] = useState(getClientSettings())

    const updateSetting = useCallback(
        <K extends keyof Setting, V extends Setting[K]>(key: K, val: V) => {
            setClientSettingsByName(key, val)
            setSetting(getClientSettings())
        },
        [],
    )

    const providerValue = useMemo(
        () => [setting, updateSetting] as [Setting, typeof dummyUpdateSetting],
        [setting, updateSetting],
    )

    return (
        <ClientSettingContext.Provider value={providerValue}>
            {children}
        </ClientSettingContext.Provider>
    )
}

export const useClientSetting = () => {
    return useContext(ClientSettingContext)
}

const getTimezone = (settingTz: string) => {
    // if settingTz is "system"
    if (settingTz === defaultSettings["timezone"]) {
        // return current timezone
        return new window.Intl.DateTimeFormat().resolvedOptions().timeZone
    }

    return settingTz
}

export const useClientLocale = () => {
    const [setting] = useClientSetting()

    const settingLocale = setting?.locale
    let locale = settingLocale
    if (locale === defaultSettings["locale"]) {
        locale = navigator.language.startsWith("ko") ? "ko" : "en"
    }

    return locale
}

export const useClientTimezone = () => {
    const [setting] = useClientSetting()

    const settingTz = setting?.timezone
    const tz = getTimezone(settingTz)

    return tz
}

export const getClientTimezone = () => {
    const [setting] = useClientSetting()

    const settingTz = setting?.timezone
    const tz = getTimezone(settingTz)

    return tz
}

export const useClientTheme = (systemTheme: LightDark) => {
    const [setting] = useClientSetting()
    const theme = setting?.theme === "system" ? systemTheme : setting?.theme

    return themes[theme]
}
