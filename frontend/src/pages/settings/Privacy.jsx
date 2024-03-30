import { useRouteLoaderData, useSubmit } from "react-router-dom"

import PageTitle from "@components/common/PageTitle"
import Section, { Name, Description, Value, Sync } from "@components/settings/Section"
import Switch from "@components/settings/Switch"
import Select from "@components/settings/Select"

const Privacy = () => {
    const settings = useRouteLoaderData("settings")
    const submit = useSubmit()

    return <>
        <PageTitle>Privacy</PageTitle>
        <Section>
            <Name>Accept follow manually <Sync /></Name>
            <Description>Follow requests will be pending until you accept them.</Description>
            <Value>
                <Switch 
                    settings={settings} submit={submit}
                    name="follow_request_approval_manually" online
                />
            </Value>
        </Section>

        <Section>
            <Name>Accept follows of your followings automatically <Sync /></Name>
            <Description>If one of your followings sends you follow request, you accept it without your action.</Description>
            <Value>
                <Switch 
                    settings={settings} submit={submit}
                    name="follow_request_approval_for_followings" online
                />
            </Value>
        </Section>

        <Section>
            <Name>Visibility of my followings & followers list <Sync /></Name>
            <Description>You can set who can see your personal connections.</Description>
            <Value>
                <Select
                    settings={settings} submit={submit}
                    name="follow_list_privacy" choices={privacyChoices} online
                />
            </Value>
        </Section>
    </>
}

const privacyChoices = [
    {
        display: "Everyone",
        value: "public",
    },
    {
        display: "Limit to my followers",
        value: "protected",
    },
    {
        display: "Only me",
        value: "private",
    },
]

export default Privacy