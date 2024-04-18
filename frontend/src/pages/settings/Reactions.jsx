import PageTitle from "@components/common/PageTitle"
import Section, { Name, Value, Sync } from "@components/settings/Section"

const Reactions = () => {
    return <>
        <PageTitle>Reactions <Sync /></PageTitle>
        <Section>
            <Name>Favorite emojis</Name>
            <Value>

            </Value>
        </Section>

        <Section>
            <Name>Emojis to avoid</Name>
            <Value>

            </Value>
        </Section>
    </>
}

export default Reactions