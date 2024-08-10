import Section, { Name } from "@components/settings/Section"

import { useTranslation } from "react-i18next"

const Info = () => {
    const { t } = useTranslation("settings", { keyPrefix: "info" })

    return (
        <>
            <Section>
                <Name>Work In Progress</Name>
            </Section>
        </>
    )
}

export default Info
