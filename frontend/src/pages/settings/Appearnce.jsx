import { useMemo } from "react"

import PageTitle from "@components/common/PageTitle"
import Section, { Name, Value } from "@components/settings/Section"
import Select from "@components/settings/Select"
import Switch from "@components/settings/SettingSwitch"

import { useTranslation } from "react-i18next"

const Appearance = () => {
    const { t } = useTranslation(null, {keyPrefix: "settings.appearance"})

    const themeChoices = useMemo(() => makeThemeChoices(t), [t])
    const widthChoices = useMemo(() => makeWidthChoices(t), [t])

    return <>
        <PageTitle>{t("title")}</PageTitle>
        <Section>
            <Name>{t("theme.name")}</Name>
            <Value>
                <Select choices={themeChoices} name="theme" />
            </Value>
        </Section>

        <Section>
            <Name>{t("main_width.name")}</Name>
            <Value>
                <Select choices={widthChoices} name="main_width" />
            </Value>
        </Section>

        <Section>
            <Name>{t("close_sidebar_on_startup.name")}</Name>
            <Value>
                <Switch name="close_sidebar_on_startup" />
            </Value>
        </Section>
    </>
}

const makeThemeChoices = t => [
    {
        display: t("theme.values.system"),
        value: "system",
    },
    {
        display: t("theme.values.light"),
        value: "light",
    },
    {
        display: t("theme.values.light-systemcolor"),
        value: "light-systemcolor",
    },
]

const makeWidthChoices = t => [
    {
        display: t("main_width.values.narrow"),
        value: "7rem",
    }, 
    {
        display: t("main_width.values.normal"),
        value: "5rem",
    }, 
    {
        display: t("main_width.values.wide"),
        value: "2rem",
    }, 
]

export default Appearance