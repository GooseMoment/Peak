import { useState } from "react"
import { Form, useRouteLoaderData } from "react-router-dom"

import PageTitle from "@components/common/PageTitle"
import Section, { Name, Value, Sync } from "@components/settings/Section"
import Button from "@components/sign/Button"
import Input from "@components/sign/Input"

import notify from "@utils/notify"
import { patchPassword } from "@api/users.api"

import { Key, RotateCw } from "feather-icons-react"
import styled from "styled-components"

const Account = () => {
    const user = useRouteLoaderData("app")
    const [passwordFormOpened, setPasswordFormOpened] = useState(false)
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

        try {
            const result = await patchPassword(currentPassword, newPassword)
            if (result === true) {
                notify.success("Password was changed.")
                return
            }
        } catch (e) {
            if (e.response?.data?.code === "PATCHPASSWORD_WRONG_CURRENT_PASSWORD") {
                notify.error("Current password does not match!")
                return
            }
            notify.error("Password was not changed.")
        }

    }

    return <>
        <PageTitle>Account <Sync /></PageTitle>
        <Section>
            <ImgNameEmailContainer>
                <ProfileImg src={user.profile_img} />
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
                Change password
                <ToggleButton onClick={() => setPasswordFormOpened(prev => !prev)}>
                    {passwordFormOpened ? "Close" : "Open"}
                </ToggleButton>
            </Name>
            <Value>

                {passwordFormOpened ? <PasswordChangeInputs>
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
                        <SubmitButton onClick={resetPassword}>Change</SubmitButton>
                    </div>
                </PasswordChangeInputs> : <PasswordChangeInputsEmpty />}
            </Value>
        </Section>
    </>
}

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

const ToggleButton = styled(Button)`
    margin-left: 1em;
`

const PasswordChangeInputs = styled.div`
    margin-top: 1em;
    display: flex;
    flex-direction: column;
    gap: 1em;
`

const PasswordChangeInputsEmpty = styled.div`
    margin-top: 1em;
    width: 100%;
    height: calc(1em * 4 + 0.75em * 7 + 1em * 3 + 0.5em * 2 + 1em);
`

export default Account