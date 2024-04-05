import { Form, useRouteLoaderData } from "react-router-dom"

import PageTitle from "@components/common/PageTitle"
import Section, { Name, Value, Sync } from "@components/settings/Section"
import Button from "@components/sign/Button"
import Input from "@components/sign/Input"

import PasswordSection from "@components/settings/PasswordSection"

import { cubicBeizer } from "@assets/keyframes"

import { Image } from "feather-icons-react"
import styled from "styled-components"

const Account = () => {
    const user = useRouteLoaderData("app")

    const openProfileImgEdit = () => {
        alert("edit")
    }

    return <>
        <PageTitle>Account <Sync /></PageTitle>
        <Section>
            <ImgNameEmailContainer>
                <ProfileImgContainer>
                    <ProfileImg src={user.profile_img} />
                    <ProfileImgOverlay onClick={openProfileImgEdit}>
                        <Image />
                    </ProfileImgOverlay>
                </ProfileImgContainer> 
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

const ProfileImgContainer = styled.div`
    position: relative;
`

const ProfileImgOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 7em;
    height: 7em;
    
    border-radius: 999px;
    color: white;
    background-color: black;

    display: flex;
    justify-content: center;
    align-items: center;

    opacity: 0;

    &:hover {
        opacity: 75%;
    }

    cursor: pointer;

    transition: opacity ${cubicBeizer} 0.25s;

    & svg {
        margin-right: 0;
        width: 2em;
        height: 2em;
    }
`

const ImgNameEmailContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2.5em;
`

const ProfileImg = styled.img`
    width: 7em;
    height: 7em;
    border-radius: 999px;

    user-select: none;
    background-color: grey;
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