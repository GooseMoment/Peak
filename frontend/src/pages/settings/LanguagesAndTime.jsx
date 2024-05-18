import Switch from "@components/settings/SettingSwitch"
import PageTitle from "@components/common/PageTitle"
import Section, { Name, Value } from "@components/settings/Section"
import Select from "@components/settings/Select"

import timezones from "@assets/settings/timezones.json"

import { useClientLocale } from "@utils/clientSettings"
import { useTranslation } from "react-i18next"

const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone

const LanguagesAndTime = () => {
    const locale = useClientLocale()
    const { t } = useTranslation(null, {lng: locale, keyPrefix: "settings.languages_and_time"})

    const timezoneSystemChoice = {
        display: t("timezone.system") + ` (${browserTz})`,
        value: "system",
    }

    return <>
        <PageTitle>{t("title")}</PageTitle>
        <Section>
            <Name>{t("locale.name")}</Name>
            <Value>
                <Select name="locale" choices={languageChoices} />
            </Value>
        </Section>
        <Section>
            <Name>{t("timezone.name")}</Name>
            <Value>
                <Select name="timezone" choices={[timezoneSystemChoice].concat(timezones)} />
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
}

const languageNames = code => {
    return new Intl.DisplayNames([], {
        type: 'language'
    }).of(code)
}

const languageChoices = [
    {
        display: "Default",
        value: "system",
    },
    {
        display: languageNames("en"),
        value: "en",
    },
    {
        display: languageNames("ko"),
        value: "ko",
    },
]

export default LanguagesAndTime
