import { useState } from "react"

import Button, { ButtonGroup, buttonForms } from "@components/common/Button"
import Section, { Name, Value } from "@components/settings/Section"
import Input from "@components/sign/Input"

import { patchPassword } from "@api/users.api"

import { Key, RotateCw } from "feather-icons-react"
import styled from "styled-components"
import { states } from "@assets/themes"

import { useClientLocale } from "@utils/clientSettings"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const PasswordSection = () => {
    const locale = useClientLocale()
    const { t } = useTranslation("", {lng: locale, keyPrefix: "settings.account"})

    const [passwordFormOpened, setPasswordFormOpened] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordAgain, setNewPasswordAgain] = useState("")

    const changePassword = async e => {
        e.preventDefault()

        if (newPassword.length < 8) {
            toast.error(t("password_too_short"))
            return
        }

        if (currentPassword === newPassword) {
            toast.error(t("password_is_same"))
            return
        }

        if (newPassword !== newPasswordAgain) {
            toast.error(t("password_not_match"))
            return
        }

        try {
            const result = await patchPassword(currentPassword, newPassword)
            if (result === true) {
                toast.success(t("password_change_success"))
                return
            }
        } catch (e) {
            if (e.response?.data?.code === "PATCHPASSWORD_WRONG_CURRENT_PASSWORD") {
                toast.error(t("password_wrong"))
                return
            }
            toast.error(t("password_change_error"))
        }

    }

    return <Section>
        <Name>
            {t("change_password")}
            <ToggleButton onClick={() => setPasswordFormOpened(prev => !prev)}>
                {passwordFormOpened ? t("section_close") : t("section_open")}
            </ToggleButton>
        </Name>
        <Value>
            {passwordFormOpened ? <PasswordChangeForm onSubmit={changePassword}>
                <Input 
                    icon={<Key />} name="password" type="password" placeholder={t("current_password")} required
                    value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                />
                <Input
                    icon={<Key />} name="new_password" type="password" placeholder={t("new_password")} required
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                />
                <Input
                    icon={<RotateCw />} name="new_password_again" type="password" placeholder={t("new_password_again")} required 
                    value={newPasswordAgain} onChange={e => setNewPasswordAgain(e.target.value)}
                />
                <div>
                    <ButtonGroup $justifyContent="right">
                        <Button $form={buttonForms.filled} $state={states.primary} type="submit">{t("button_change")}</Button>
                    </ButtonGroup>
                </div>
            </PasswordChangeForm> : <PasswordChangeInputsEmpty />}
        </Value>
    </Section>
}

const ToggleButton = styled(Button)`
    margin-left: 1em;
`

const PasswordChangeForm = styled.form`
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

export default PasswordSection