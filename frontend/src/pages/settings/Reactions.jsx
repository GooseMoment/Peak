import Section, { Description, Name, Value } from "@components/settings/Section"

import { useTranslation } from "react-i18next"

const Reactions = () => {
    const { t } = useTranslation("settings", { keyPrefix: "reactions" })

    // TODO: use react-query to receive data

    return (
        <>
            <Section>
                <Name>{t("favorite_emojis.name")}</Name>
                <Description>{t("favorite_emojis.description")}</Description>
                <Value></Value>
            </Section>

            <Section>
                <Name>{t("dislikable_emojis.name")}</Name>
                <Description>{t("dislikable_emojis.description")}</Description>
                <Value></Value>
            </Section>
        </>
    )
}

export default Reactions
