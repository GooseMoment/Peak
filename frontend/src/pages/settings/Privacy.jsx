import Switch from "@/components/settings/Switch"
import PageTitle from "@components/common/PageTitle"
import Section, { Name, Description, Value, Sync } from "@components/settings/Section"
import { useState } from "react"

const Privacy = () => {
    const [accept_follow_manually, set_accept_follow_manually] = useState(false)

    return <>
        <PageTitle>Privacy</PageTitle>
        <Section>
            <Name>Accept follow manually <Sync /></Name>
            <Description>Follow requests will be pending until you accept them.</Description>
            <Value>
                <Switch isActive={accept_follow_manually} setIsActive={set_accept_follow_manually}  />
            </Value>
        </Section>

        <Section>
            <Name>Accept follows of your followings automatically <Sync /></Name>
            <Description>If one of your followings sends you follow request, you accept it without your action.</Description>
            <Value>
                <Switch isActive={accept_follow_manually} setIsActive={set_accept_follow_manually}  />
            </Value>
        </Section>

        <Section>
            <Name>Visibility of my followings & followers list <Sync /></Name>
            <Description>You can set who can see your personal connections.</Description>
            <Value>
                <select>
                    <option value="public">Everyone</option>
                    <option value="private">Limit to my followers</option>
                    <option value="me">Only me</option>
                </select>
            </Value>
        </Section>
    </>
}

export default Privacy