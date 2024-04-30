import Switch from "@components/settings/SettingSwitch"
import PageTitle from "@components/common/PageTitle"
import Section, { Name, Value } from "@components/settings/Section"
import Select from "@components/settings/Select"

const LanguagesAndRegion = () => {
    return <>
        <PageTitle>Languages & Region</PageTitle>
        <Section>
            <Name>Language</Name>
            <Value>
                <Select name="language" choices={languageChoices} />
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

const languageChoices = [
    {
        display: "English",
        value: "en",
    },
    {
        display: "한국어",
        value: "ko",
    },
]

export default LanguagesAndRegion