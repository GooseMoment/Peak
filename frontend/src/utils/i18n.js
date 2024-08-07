import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import Backend from "i18next-http-backend"
import { useClientLocale } from "./clientSettings"
import { useEffect } from "react"

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .use(Backend)
    .init({
        fallbackLng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    })

export const I18nSetLocale = ({ i18n }) => {
    const locale = useClientLocale()

    useEffect(() => {
        i18n.changeLanguage(locale)
    }, [locale])

    return null
}

export default i18n
