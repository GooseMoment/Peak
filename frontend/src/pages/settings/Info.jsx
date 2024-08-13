import Section, { Name, Value } from "@components/settings/Section"

import { useTranslation } from "react-i18next"

const buildTimestamp = import.meta.env.VITE_BUILD_TIMESTAMP

const Info = () => {
    const { t } = useTranslation("settings", { keyPrefix: "info" })

    return (
        <>
            <Section>
                <Name>{t("built.name")}</Name>
                <Value>{t("built.built_at")}: {buildTimestamp}</Value>
            </Section>
        </>
    )
}

export default Info
