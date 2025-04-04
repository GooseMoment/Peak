import { createContext, useContext, useMemo, useState } from "react"

import themes from "@assets/themes"

const KEY_CLIENT_SETTINGS = "client_settings"

const defaultSettings = {
    // general
    startpage: "home",
    delete_task_after_alert: true,

    // Languages & Region
    //      locale = language + "-" + region
    locale: "system",
    timezone: "system",

    start_of_the_week_monday: false,
    time_as_24_hour: false,

    // Notifications
    push_notification_subscription: null,
    push_notification_excluded_types: [],
    play_notification_sound: true,

    // Appearance
    theme: "system",
    main_width: "5rem",
    close_sidebar_on_startup: false,
}

export const getClientSettings = () => {
    try {
        return (
            JSON.parse(localStorage.getItem(KEY_CLIENT_SETTINGS)) ||
            defaultSettings
        )
    } catch {
        return defaultSettings
    }
}

export const setClientSettingsByName = (name, value) => {
    let settings = getClientSettings()
    settings[name] = value
    localStorage.setItem(KEY_CLIENT_SETTINGS, JSON.stringify(settings))
}

export const initClientSettings = () => {
    let settings = getClientSettings()
    if (!settings?.theme) {
        settings = defaultSettings
    }
    settings = Object.assign({}, defaultSettings, settings)
    localStorage.setItem(KEY_CLIENT_SETTINGS, JSON.stringify(settings))
}

const ClientSettingContext = createContext()

export const ClientSettingProvider = ({ children }) => {
    const [setting, setSetting] = useState(getClientSettings())

    const updateSetting = useMemo(
        () => (key, val) => {
            setClientSettingsByName(key, val)
            setSetting(getClientSettings())
        },
        [],
    )

    const providerValue = useMemo(
        () => [setting, updateSetting],
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

const getTimezone = (settingTz) => {
    if (settingTz === defaultSettings["timezone"]) {
        return new window.Intl.DateTimeFormat().resolvedOptions().timeZone
    }

    return settingTz
}

export const useClientLocale = () => {
    const [setting] = useContext(ClientSettingContext)

    const settingLocale = setting?.locale
    let locale = settingLocale
    if (locale === defaultSettings["locale"]) {
        locale = navigator.language.startsWith("ko") ? "ko" : "en"
    }

    return locale
}

export const useClientTimezone = () => {
    const [setting] = useContext(ClientSettingContext)

    const settingTz = setting?.timezone
    const tz = getTimezone(settingTz)

    return tz
}

export const getClientTimezone = () => {
    const setting = getClientSettings()

    const settingTz = setting?.timezone
    const tz = getTimezone(settingTz)

    return tz
}

export const useClientTheme = (systemTheme) => {
    const [setting] = useContext(ClientSettingContext)
    const theme = setting?.theme === "system" ? systemTheme : setting?.theme

    return themes[theme]
}
