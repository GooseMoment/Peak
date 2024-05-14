import Switch from "@components/settings/SettingSwitch"
import PageTitle from "@components/common/PageTitle"
import Section, { Name, Value } from "@components/settings/Section"
import Select from "@components/settings/Select"

import timezones from "@assets/settings/timezones.json"

const LanguagesAndRegion = () => {
    return <>
        <PageTitle>Languages & Time</PageTitle>
        <Section>
            <Name>Language</Name>
            <Value>
                <Select name="locale" choices={languageChoices} />
            </Value>
        </Section>
        <Section>
            <Name>Timezone</Name>
            <Value>
                <Select name="timezone" choices={timezones} />
            </Value>
        </Section>
        <Section>
            <Name>Display the start of the week as Monday</Name>
            <Value>
                <Switch name="start_of_the_week_monday" />
            </Value>
        </Section>
        <Section>
            <Name>Display time as a 24-hour</Name>
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

export default LanguagesAndRegion