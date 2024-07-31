import { useMemo } from "react"

import PageTitle from "@components/common/PageTitle"
import Section, { Name, Description, Value } from "@components/settings/Section"
import Select from "@components/settings/Select"
import Switch from "@components/settings/SettingSwitch"

import themes from "@assets/themes"

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
            <Description>{t("main_width.description")}</Description>
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

const makeThemeChoices = t => {
    const keys = Object.keys(themes)
    const prefix = "theme.values."

    return keys.map(value => ({
        display: t(prefix + value),
        value
    }))
}

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