import Switch from "@components/settings/Switch"
import PageTitle from "@components/common/PageTitle"
import Section, { Name, Value } from "@components/settings/Section"
import { useState } from "react"

const Appearance = () => {
    const [test, setTest] = useState(false)

    return <>
        <PageTitle>Appearance</PageTitle>
        <Section>
            <Name>Theme perference</Name>
            <Value>
                <select>
                    <option>Light</option>
                    <option>Dark</option>
                    <option>Indigo Blue</option>
                    <option>Passion Red</option>
                </select>
            </Value>
        </Section>

        <Section>
            <Name>Content width</Name>
            <Value>
                <select>
                    <option>More Narrow</option>
                    <option>Narrow</option>
                    <option>Normal</option>
                    <option>Wide</option>
                    <option>More Wide</option>
                </select>
            </Value>
        </Section>

        <Section>
            <Name>Close sidebar by default</Name>
            <Value>
                <Switch isActive={test} setIsActive={setTest} />
            </Value>
        </Section>
    </>
}

export default Appearance