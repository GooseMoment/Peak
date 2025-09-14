import { useEffect } from "react"

import { useClientLocale } from "@utils/clientSettings"

import i18n, { type CustomTypeOptions, type i18n as i18nType } from "i18next"
import resourcesToBackend from "i18next-resources-to-backend"
import { initReactI18next } from "react-i18next"

type TranslationLanguage = "en" | "ko"

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .use(
        resourcesToBackend(
            (
                language: TranslationLanguage,
                namespace: keyof CustomTypeOptions["resources"],
            ) => import(`@assets/locales/${language}/${namespace}.json`),
        ),
    )
    .init({
        // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        fallbackLng: "en",
        interpolation: {
            // react already safes from xss
            escapeValue: false,
        },
    })

export const I18nSetLocale = ({ i18n }: { i18n: i18nType }) => {
    const locale = useClientLocale()

    useEffect(() => {
        i18n.changeLanguage(locale)
    }, [locale, i18n])

    return null
}

export default i18n
