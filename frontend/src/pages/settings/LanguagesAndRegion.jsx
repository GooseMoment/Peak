import Switch from "@components/settings/Switch"
import PageTitle from "@components/common/PageTitle"
import Section, { Name, Description, Value, Sync } from "@components/settings/Section"
import { useState } from "react"

const LanguagesAndRegion = () => {
    const [test, setTest] = useState(true)

    return <>
        <PageTitle>Languages & Region</PageTitle>
        <Section>
            <Name>Language</Name>
            <Value>
                <select>
                    <option value="en">English</option>
                    <option value="ko">한국어</option>
                </select>
            </Value>
        </Section>
        <Section>
            <Name>Display the start of the week as Monday</Name>
            <Value>
                <Switch isActive={test} setIsActive={setTest} />
            </Value>
        </Section>
        <Section>
            <Name>Display time as a 24-hour</Name>
            <Value>
                <Switch isActive={test} setIsActive={setTest} />
            </Value>
        </Section>
    </>
}

export default LanguagesAndRegion