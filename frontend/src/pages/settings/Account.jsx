import { useState } from "react"
import { Form, useRouteLoaderData } from "react-router-dom"

import PageTitle from "@components/common/PageTitle"
import Section, { Name, Value, Sync } from "@components/settings/Section"
import Button from "@components/sign/Button"
import Input from "@components/sign/Input"

import notify from "@utils/notify"

import { Key, RotateCw } from "feather-icons-react"
import styled from "styled-components"

const Account = () => {
    const user = useRouteLoaderData("app")
    const [resetFormOpened, setResetFormOpened] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordAgain, setNewPasswordAgain] = useState("")

    const resetPassword = async () => {
        if (newPassword.length < 8) {
            notify.error("New password is too short.")
            return
        }

        if (currentPassword === newPassword) {
            notify.error("New password is same with current password.")
            return
        }

        if (newPassword !== newPasswordAgain) {
            notify.error("New password does not match.")
            return
        }


        // TODO: send reset request
        notify.success("Password was changed.")
    }

    return <>
        <PageTitle>Account <Sync /></PageTitle>
        <Section>
            <ImgNameEmailContainer>
                <ProfileImg src={user.profile_img_uri} />
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

        <Section>
            <Name>
                Reset password
                <ToggleButton onClick={() => setResetFormOpened(prev => !prev)}>
                    {resetFormOpened ? "Close" : "Open"}
                </ToggleButton>
            </Name>
            <Value>

                {resetFormOpened ? <PasswordResetInputs>
                    <Input 
                        icon={<Key />} name="password" type="password" placeholder="Current password" required
                        value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                    />
                    <Input
                        icon={<Key />} name="new_password" type="password" placeholder="New password" required
                        value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    />
                    <Input
                        icon={<RotateCw />} name="new_password_again" type="password" placeholder="New password (Type again)" required 
                        value={newPasswordAgain} onChange={e => setNewPasswordAgain(e.target.value)}
                    />
                    <div>
                        <SubmitButton onClick={resetPassword}>Reset</SubmitButton>
                    </div>
                </PasswordResetInputs> : null}
            </Value>
        </Section>
    </>
}

const ImgNameEmailContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 3em;
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

const ToggleButton = styled(Button)`
    margin-left: 1em;
`

const PasswordResetInputs = styled.div`
    margin-top: 1em;
    display: flex;
    flex-direction: column;
    gap: 1em;
`

export default Account