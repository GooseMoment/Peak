import { useMemo } from "react"

import type { LightDark } from "styled-components"

import Section, { Description, Name, Value } from "@components/settings/Section"
import Select from "@components/settings/Select"
import Switch from "@components/settings/SettingSwitch"

import { TFunction } from "i18next"
import { useTranslation } from "react-i18next"

const Appearance = () => {
    const { t } = useTranslation("settings", { keyPrefix: "appearance" })

    const themeChoices = useMemo(() => makeThemeChoices(t), [t])
    const widthChoices = useMemo(() => makeWidthChoices(t), [t])

    return (
        <>
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
    )
}

const makeThemeChoices = (t: TFunction<"settings", "appearance">) => {
    const keys: ("system" | LightDark)[] = ["system", "light", "dark"]

    return keys.map((value) => ({
        display: t(`theme.values.${value}`),
        value,
    }))
}

const makeWidthChoices = (t: TFunction<"settings", "appearance">) => [
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
