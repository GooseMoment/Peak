import { createContext, useContext, useMemo, useState } from "react"

const KEY_CLIENT_SETTINGS = "client_settings"

const defaultSettings = {
    // Languages & Region
    language: navigator.language,
    timezone: "system",
    start_of_the_week_monday: false,
    time_as_24_hour: false,

    // Notifications
    send_push_notifications: true,
    play_notification_sound: true,

    // Appearance
    theme: "system",
    main_width: "5rem",
    close_sidebar_on_startup: false,
}

export const getClientSettings = () => {
    return JSON.parse(localStorage.getItem(KEY_CLIENT_SETTINGS)) || defaultSettings
}

export const setClientSettingsByName = (name, value) => {
    let settings = getClientSettings()
    settings[name] = value
    localStorage.setItem(KEY_CLIENT_SETTINGS, JSON.stringify(settings))
}

export const initClientSettings = () => {
    let settings = getClientSettings()
    if (!(settings?.language)) {
        settings = defaultSettings
    }
    settings = Object.assign(defaultSettings, settings)
    localStorage.setItem(KEY_CLIENT_SETTINGS, JSON.stringify(settings))
}

const ClientSettingContext = createContext()

export const ClientSettingProvider = ({children}) => {
    const [setting, setSetting] = useState(getClientSettings())

    const updateSetting = useMemo(
        () => ((key, val) => {
            setClientSettingsByName(key, val)
            setSetting(getClientSettings())
        }), []
    )

    const providerValue = useMemo(() => [setting, updateSetting], [setting, updateSetting])

    return <ClientSettingContext.Provider value={providerValue} >
        {children}
    </ClientSettingContext.Provider>
}

export const useClientSetting = () => {
    return useContext(ClientSettingContext)
}
