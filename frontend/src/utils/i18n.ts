import { useEffect } from "react"

import { useClientLocale } from "./clientSettings"

import i18n, { type i18n as i18nType } from "i18next"
import Backend, { type HttpBackendOptions } from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .use(Backend)
    .init<HttpBackendOptions>({
        fallbackLng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    })

export const I18nSetLocale = ({ i18n }: { i18n: i18nType }) => {
    const locale = useClientLocale()

    useEffect(() => {
        i18n.changeLanguage(locale)
    }, [locale])

    return null
}

export default i18n
