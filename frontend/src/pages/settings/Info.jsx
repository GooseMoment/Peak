import Section, { Name, Value } from "@components/settings/Section"

import { useClientLocale } from "@utils/clientSettings"

import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

const buildTimestamp = import.meta.env.VITE_BUILD_TIMESTAMP
const isProd = import.meta.env.PROD

const Info = () => {
    const { t } = useTranslation("settings", { keyPrefix: "info" })
    const locale = useClientLocale()
    const date = isProd
        ? DateTime.fromISO(buildTimestamp)
              .setLocale(locale)
              .toLocaleString(DateTime.DATETIME_FULL)
        : t("built_at.for_dev")

    return (
        <>
            <Section>
                <Name>{t("built_at.name")}</Name>
                <Value>{date}</Value>
            </Section>
        </>
    )
}

export default Info
