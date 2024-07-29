import { useMemo } from "react"

import PageTitle from "@components/common/PageTitle"
import Section, { Description, Name, Value } from "@components/settings/Section"
import Select from "@components/settings/Select"
import SettingSwitch from "@components/settings/SettingSwitch"

import { useTranslation } from "react-i18next"

const General = () => {
    const { t } = useTranslation(null, {keyPrefix: "settings.general"})

    const startpageChoices = useMemo(() => makeStartpageChoices(t), [t])

    return <>
        <PageTitle>{t("title")}</PageTitle>
        <Section>
            <Name>{t("startpage.name")}</Name>
            <Description>{t("startpage.description")}</Description>
            <Value>
                <Select choices={startpageChoices} name="startpage" />
            </Value>
        </Section>

        <Section>
            <Name>{t("delete_task_after_alert.name")}</Name>
            <Description>{t("delete_task_after_alert.description")}</Description>
            <Value>
                <SettingSwitch name="delete_task_after_alert" />
            </Value>
        </Section>
    </>
}

const makeStartpageChoices = t => [
    {
        display: t("startpage.values.home"),
        value: "home",
    }, 
    {
        display: t("startpage.values.today"),
        value: "today",
    }, 
]

export default General
