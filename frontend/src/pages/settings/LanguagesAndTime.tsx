import { useMemo } from "react"

import Section, { Name, Value } from "@components/settings/Section"
import Select from "@components/settings/Select"
import Switch from "@components/settings/SettingSwitch"

import timezonesData from "@assets/settings/timezones.json"

import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"

const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone

const LanguagesAndTime = () => {
    const { t } = useTranslation("settings", {
        keyPrefix: "languages_and_time",
    })

    const timezones = useMemo(
        () => [
            {
                display: t("timezone.system") + ` (${browserTz})`,
                value: "system",
            },
            ...timezonesData,
        ],
        [t],
    )

    const languageChoices = useMemo(() => makeLanguageChoices(t), [t])

    return (
        <>
            <Section>
                <Name>{t("locale.name")}</Name>
                <Value>
                    <Select name="locale" choices={languageChoices} />
                </Value>
            </Section>
            <Section>
                <Name>{t("timezone.name")}</Name>
                <Value>
                    <Select name="timezone" choices={timezones} />
                </Value>
            </Section>
            <Section>
                <Name>{t("start_of_the_week_monday.name")}</Name>
                <Value>
                    <Switch name="start_of_the_week_monday" />
                </Value>
            </Section>
            <Section>
                <Name>{t("time_as_24_hour.name")}</Name>
                <Value>
                    <Switch name="time_as_24_hour" />
                </Value>
            </Section>
        </>
    )
}

const languageNames = (code: string) => {
    return new Intl.DisplayNames([code], {
        type: "language",
    }).of(code)
}

const makeLanguageChoices = (
    t: TFunction<"settings", "languages_and_time">,
) => [
    {
        display: t("locale.system") + ` (${languageNames(navigator.language)})`,
        value: "system",
    },
    {
        display: languageNames("en")!,
        value: "en",
    },
    {
        display: languageNames("ko")!,
        value: "ko",
    },
]

export default LanguagesAndTime
