import Section, { Name, Value } from "@components/settings/Section"

import { useTranslation } from "react-i18next"

const buildTimestamp = import.meta.env.VITE_BUILD_TIMESTAMP
const isProd = import.meta.env.PROD

const Info = () => {
    const { t } = useTranslation("settings", { keyPrefix: "info" })

    return (
        <>
            <Section>
                <Name>{t("built_at.name")}</Name>
                <Value>{isProd ? buildTimestamp : t("built_at.for_dev")}</Value>
            </Section>
        </>
    )
}

export default Info
