import { Form, useRouteLoaderData, useRevalidator } from "react-router-dom"

import PageTitle from "@components/common/PageTitle"
import Section, { Name, Value, Sync } from "@components/settings/Section"
import Button from "@components/sign/Button"
import Input from "@components/sign/Input"

import ProfileImg from "@components/settings/ProfileImg"
import PasswordSection from "@components/settings/PasswordSection"

import styled from "styled-components"

const Account = () => {
    const user = useRouteLoaderData("app")
    const revalidator = useRevalidator()

    return <>
        <PageTitle>Account <Sync /></PageTitle>
        <Section>
            <ImgNameEmailContainer>
                <ProfileImg revalidator={revalidator} profile_img={user.profile_img} />
                <NameEmail>
                    <Username>@{user.username}</Username>
                    <Email>{user.email}</Email>
                </NameEmail>
            </ImgNameEmailContainer>
        </Section>
        <Form method="patch" navigate={false}>
            <Section>
                <Name>Display name</Name>
                <Value>
                    <Input name="display_name" type="text" defaultValue={user.display_name} placeholder="Your awesome name" />
                </Value>
            </Section>
            <Section>
                <Name>Bio</Name>
                <Value>
                    <Bio autoComplete="off" name="bio" defaultValue={user.bio} placeholder="Your awesome bio" />
                </Value>
            </Section>
            <Section>
                <SubmitButton type="submit">Submit</SubmitButton>
            </Section>
        </Form>

        <PasswordSection />
    </>
}

const ImgNameEmailContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2.5em;
`

const NameEmail = styled.div`
    display: flex;
    gap: 1em;
    flex-direction: column;
`

const Username = styled.div`
    font-weight: 600;
    font-size: 1.25em;
`

const Email = styled.div`

`

const Bio = styled.textarea`
    height: 7em;
    width: 100%;
    resize: none;
    box-sizing: border-box;
    padding: 1em;
    border: none;

    border: 1px black solid;
    border-radius: 10px;
`

const SubmitButton = styled(Button)`
    float: right;
`

export default Account