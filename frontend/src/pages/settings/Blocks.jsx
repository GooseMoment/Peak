import PageTitle from "@components/common/PageTitle"
import Section, { Name, Value, Sync } from "@components/settings/Section"

const Blocks = () => {
    return <>
        <PageTitle>Blocks <Sync /></PageTitle>
        <Section>
            <Name>Users blocked by me</Name>
            <Value>
                @andless2004<br/>
                @jedbeom<br/>
            </Value>
        </Section>
    </>
}

export default Blocks