import { useRouteLoaderData } from "react-router-dom"

import PageTitle from "@components/common/PageTitle"
import Section, { Name, Value, Sync } from "@components/settings/Section"
import Button from "@components/sign/Button"

const Account = () => {
    const user = useRouteLoaderData("app")

    return <>
        <PageTitle>Account</PageTitle>
        <Section>
            <Name>@{user.username} <Sync /></Name>
            <Value>
                <Button>Edit profile</Button>
            </Value>
        </Section>

        <Section>
            <Name>Reset password <Sync /></Name>
            <Value>
                <Button>Reset</Button>
            </Value>
        </Section>
    </>
}

export default Account