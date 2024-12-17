import Error from "@components/settings/Error"
import Section, { Description, Name, Value } from "@components/settings/Section"

import { useTranslation } from "react-i18next"

const Security = () => {
    const { t } = useTranslation("settings", { keyPrefix: "security" })
    const isError = false

    if (isError) {
        return <Error />
    }

    return (
        <>
            <Section>
                <Name>{t("two_factor_auth.name")}</Name>
                <Description>{t("two_factor_auth.description")}</Description>
                <Value>
                </Value>
            </Section>
        </>
    )
}

export default Security
